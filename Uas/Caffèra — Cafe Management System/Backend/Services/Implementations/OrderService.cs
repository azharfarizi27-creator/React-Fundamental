using Caffera.Backend.DTOs.Common;
using Caffera.Backend.DTOs.Order;
using Caffera.Backend.Models;
using Caffera.Backend.Repositories.Interfaces;
using Caffera.Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Caffera.Backend.Services.Implementations;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IRepository<Menu> _menuRepository;
    private readonly IRepository<Table> _tableRepository;
    private readonly IRepository<User> _userRepository;
    private readonly ILogger<OrderService> _logger;

    public OrderService(
        IOrderRepository orderRepository,
        IRepository<Menu> menuRepository,
        IRepository<Table> tableRepository,
        IRepository<User> userRepository,
        ILogger<OrderService> logger)
    {
        _orderRepository = orderRepository;
        _menuRepository = menuRepository;
        _tableRepository = tableRepository;
        _userRepository = userRepository;
        _logger = logger;
    }

    public async Task<ApiResponse<PagedResult<OrderDto>>> GetAllAsync(OrderFilterParams filterParams)
    {
        _logger.LogInformation("[ORDER] 📋 Mengambil daftar pesanan (Page: {Page}, Size: {Size}, Status: '{Status}', Type: '{Type}', Search: '{Search}')",
            filterParams.PageNumber, filterParams.PageSize, filterParams.Status ?? "All", filterParams.OrderType ?? "All", filterParams.Search ?? "-");

        var query = _orderRepository.Query()
            .Include(o => o.User)
            .Include(o => o.Table)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Menu)
            .AsQueryable();

        // 1. Search filter (OrderNumber, Customer/User, Table)
        if (!string.IsNullOrWhiteSpace(filterParams.Search))
        {
            var search = filterParams.Search.Trim().ToLower();
            query = query.Where(o => o.OrderNumber.ToLower().Contains(search) || 
                                     o.User!.Name.ToLower().Contains(search));
        }

        // 2. Status filter
        if (!string.IsNullOrWhiteSpace(filterParams.Status))
        {
            query = query.Where(o => o.Status.ToLower() == filterParams.Status.Trim().ToLower());
        }

        // 3. OrderType filter
        if (!string.IsNullOrWhiteSpace(filterParams.OrderType))
        {
            query = query.Where(o => o.OrderType.ToLower() == filterParams.OrderType.Trim().ToLower());
        }

        // 4. Date range filter
        if (filterParams.StartDate.HasValue)
        {
            query = query.Where(o => o.CreatedAt >= filterParams.StartDate.Value.Date);
        }

        if (filterParams.EndDate.HasValue)
        {
            var endOfDay = filterParams.EndDate.Value.Date.AddDays(1).AddTicks(-1);
            query = query.Where(o => o.CreatedAt <= endOfDay);
        }

        var totalCount = await query.CountAsync();

        // 5. Sorting
        query = filterParams.SortBy?.ToLower() switch
        {
            "totalamount" => filterParams.IsAscending ? query.OrderBy(o => o.TotalAmount) : query.OrderByDescending(o => o.TotalAmount),
            "ordernumber" => filterParams.IsAscending ? query.OrderBy(o => o.OrderNumber) : query.OrderByDescending(o => o.OrderNumber),
            "status" => filterParams.IsAscending ? query.OrderBy(o => o.Status) : query.OrderByDescending(o => o.Status),
            _ => query.OrderByDescending(o => o.CreatedAt)
        };

        // 6. Pagination
        var skip = (filterParams.PageNumber - 1) * filterParams.PageSize;
        var orders = await query.Skip(skip).Take(filterParams.PageSize).ToListAsync();

        var dtos = orders.Select(MapToOrderDto);

        var pagedResult = new PagedResult<OrderDto>
        {
            Items = dtos,
            PageNumber = filterParams.PageNumber,
            PageSize = filterParams.PageSize,
            TotalCount = totalCount
        };

        return ApiResponse<PagedResult<OrderDto>>.SuccessResult(pagedResult);
    }

    public async Task<ApiResponse<OrderDto>> GetByIdAsync(int id)
    {
        _logger.LogInformation("[ORDER] 🔍 Mengambil detail pesanan ID: {OrderId}", id);
        var order = await _orderRepository.GetOrderWithDetailsAsync(id);
        if (order == null)
        {
            _logger.LogWarning("[ORDER] ⚠️ Pesanan dengan ID {OrderId} tidak ditemukan", id);
            return ApiResponse<OrderDto>.FailResult("Pesanan tidak ditemukan");
        }

        return ApiResponse<OrderDto>.SuccessResult(MapToOrderDto(order));
    }

    public async Task<ApiResponse<OrderDto>> GetByOrderNumberAsync(string orderNumber)
    {
        _logger.LogInformation("[ORDER] 🔍 Mengambil detail pesanan berdasarkan Nomor: '{OrderNumber}'", orderNumber);
        var order = await _orderRepository.GetOrderByNumberWithDetailsAsync(orderNumber.Trim());
        if (order == null)
        {
            _logger.LogWarning("[ORDER] ⚠️ Pesanan dengan Nomor '{OrderNumber}' tidak ditemukan", orderNumber);
            return ApiResponse<OrderDto>.FailResult("Pesanan tidak ditemukan");
        }

        return ApiResponse<OrderDto>.SuccessResult(MapToOrderDto(order));
    }

    public async Task<ApiResponse<OrderDto>> CreateAsync(int userId, CreateOrderDto dto)
    {
        _logger.LogInformation("[ORDER] 🛒 Membuat pesanan baru oleh User ID: {UserId}, Tipe: {OrderType}, Jumlah Menu: {Count}", 
            userId, dto.OrderType, dto.Items.Count);

        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            _logger.LogWarning("[ORDER] ⚠️ Gagal membuat pesanan: User ID {UserId} tidak ditemukan di database", userId);
            return ApiResponse<OrderDto>.FailResult("Kasir/Pengguna tidak valid");
        }

        Table? table = null;
        if (dto.OrderType.Equals("DineIn", StringComparison.OrdinalIgnoreCase))
        {
            if (!dto.TableId.HasValue)
            {
                _logger.LogWarning("[ORDER] ⚠️ Gagal membuat pesanan Dine In: TableId tidak disertakan");
                return ApiResponse<OrderDto>.FailResult("Meja wajib dipilih untuk pesanan Dine In");
            }

            table = await _tableRepository.GetByIdAsync(dto.TableId.Value);
            if (table == null)
            {
                _logger.LogWarning("[ORDER] ⚠️ Gagal membuat pesanan: Meja ID {TableId} tidak ditemukan", dto.TableId.Value);
                return ApiResponse<OrderDto>.FailResult("Meja yang dipilih tidak ditemukan");
            }

            // Update table status to Occupied
            table.Status = "Occupied";
            table.UpdatedAt = DateTime.UtcNow;
            await _tableRepository.UpdateAsync(table);
            _logger.LogInformation("[ORDER] 🪑 Status Meja #{TableNumber} (ID: {TableId}) diubah menjadi Occupied", table.Number, table.Id);
        }

        var menuIds = dto.Items.Select(i => i.MenuId).Distinct().ToList();
        var menus = (await _menuRepository.FindAsync(m => menuIds.Contains(m.Id))).ToDictionary(m => m.Id);

        foreach (var item in dto.Items)
        {
            if (!menus.TryGetValue(item.MenuId, out var menu))
            {
                _logger.LogWarning("[ORDER] ⚠️ Gagal membuat pesanan: Menu ID {MenuId} tidak ditemukan", item.MenuId);
                return ApiResponse<OrderDto>.FailResult($"Menu dengan ID {item.MenuId} tidak ditemukan");
            }

            if (!menu.IsAvailable)
            {
                _logger.LogWarning("[ORDER] ⚠️ Gagal membuat pesanan: Menu '{MenuName}' (ID: {MenuId}) sedang Tidak Tersedia", menu.Name, menu.Id);
                return ApiResponse<OrderDto>.FailResult($"Menu '{menu.Name}' saat ini sedang tidak tersedia");
            }
        }

        var orderNumber = await _orderRepository.GenerateOrderNumberAsync();
        var order = new Order
        {
            OrderNumber = orderNumber,
            UserId = userId,
            TableId = dto.OrderType.Equals("DineIn", StringComparison.OrdinalIgnoreCase) ? dto.TableId : null,
            OrderType = dto.OrderType.Equals("TakeAway", StringComparison.OrdinalIgnoreCase) ? "TakeAway" : "DineIn",
            Status = "Pending",
            CreatedAt = DateTime.UtcNow,
            OrderItems = new List<OrderItem>()
        };

        decimal totalAmount = 0;
        foreach (var item in dto.Items)
        {
            var menu = menus[item.MenuId];
            var subtotal = menu.Price * item.Quantity;
            totalAmount += subtotal;

            order.OrderItems.Add(new OrderItem
            {
                MenuId = menu.Id,
                Quantity = item.Quantity,
                Price = menu.Price, // Snapshot price!
                Subtotal = subtotal
            });
        }

        order.TotalAmount = totalAmount;

        var createdOrder = await _orderRepository.AddAsync(order);
        var fullOrder = await _orderRepository.GetOrderWithDetailsAsync(createdOrder.Id);

        _logger.LogInformation("[ORDER] ✅ Pesanan berhasil dibuat! No: {OrderNumber} (ID: {OrderId}), Total: Rp {Total:N0}, Kasir: {Cashier}",
            order.OrderNumber, createdOrder.Id, order.TotalAmount, user.Name);

        return ApiResponse<OrderDto>.SuccessResult(MapToOrderDto(fullOrder!), "Pesanan berhasil dibuat");
    }

    public async Task<ApiResponse<OrderDto>> UpdateStatusAsync(int id, UpdateOrderStatusDto dto)
    {
        _logger.LogInformation("[ORDER] 🔄 Memperbarui status pesanan ID {OrderId} ke '{NewStatus}'", id, dto.Status);

        var order = await _orderRepository.GetOrderWithDetailsAsync(id);
        if (order == null)
        {
            _logger.LogWarning("[ORDER] ⚠️ Gagal update status: Pesanan ID {OrderId} tidak ditemukan", id);
            return ApiResponse<OrderDto>.FailResult("Pesanan tidak ditemukan");
        }

        var validStatuses = new[] { "Pending", "Preparing", "Ready", "Completed", "Cancelled" };
        if (!validStatuses.Contains(dto.Status, StringComparer.OrdinalIgnoreCase))
        {
            _logger.LogWarning("[ORDER] ⚠️ Gagal update status: Status '{InvalidStatus}' tidak valid", dto.Status);
            return ApiResponse<OrderDto>.FailResult("Status pesanan tidak valid");
        }

        var oldStatus = order.Status;
        order.Status = dto.Status;
        order.UpdatedAt = DateTime.UtcNow;

        // If completed or cancelled and has table, check if other active orders exist on that table
        if ((dto.Status.Equals("Completed", StringComparison.OrdinalIgnoreCase) || 
             dto.Status.Equals("Cancelled", StringComparison.OrdinalIgnoreCase)) && 
             order.TableId.HasValue)
        {
            var otherActiveOrders = await _orderRepository.Query()
                .AnyAsync(o => o.Id != id && o.TableId == order.TableId && (o.Status == "Pending" || o.Status == "Preparing" || o.Status == "Ready"));

            if (!otherActiveOrders)
            {
                var table = await _tableRepository.GetByIdAsync(order.TableId.Value);
                if (table != null && table.Status == "Occupied")
                {
                    table.Status = "Available";
                    table.UpdatedAt = DateTime.UtcNow;
                    await _tableRepository.UpdateAsync(table);
                    _logger.LogInformation("[ORDER] 🪑 Meja #{TableNumber} kembali menjadi Available (Pesanan selesai/dibatalkan)", table.Number);
                }
            }
        }

        await _orderRepository.UpdateAsync(order);
        var updated = await _orderRepository.GetOrderWithDetailsAsync(id);

        _logger.LogInformation("[ORDER] ✅ Status pesanan {OrderNumber} (ID: {OrderId}) berhasil diubah: '{OldStatus}' -> '{NewStatus}'",
            order.OrderNumber, order.Id, oldStatus, order.Status);

        return ApiResponse<OrderDto>.SuccessResult(MapToOrderDto(updated!), "Status pesanan berhasil diperbarui");
    }

    public async Task<ApiResponse<bool>> CancelOrderAsync(int id)
    {
        _logger.LogInformation("[ORDER] 🚫 Memproses pembatalan pesanan ID: {OrderId}", id);

        var order = await _orderRepository.GetOrderWithDetailsAsync(id);
        if (order == null)
        {
            _logger.LogWarning("[ORDER] ⚠️ Pembatalan gagal: Pesanan ID {OrderId} tidak ditemukan", id);
            return ApiResponse<bool>.FailResult("Pesanan tidak ditemukan");
        }

        if (order.Status == "Completed")
        {
            _logger.LogWarning("[ORDER] ⚠️ Pembatalan ditolak: Pesanan {OrderNumber} sudah Completed", order.OrderNumber);
            return ApiResponse<bool>.FailResult("Pesanan yang sudah selesai (Completed) tidak dapat dibatalkan");
        }

        order.Status = "Cancelled";
        order.UpdatedAt = DateTime.UtcNow;

        if (order.TableId.HasValue)
        {
            var otherActiveOrders = await _orderRepository.Query()
                .AnyAsync(o => o.Id != id && o.TableId == order.TableId && (o.Status == "Pending" || o.Status == "Preparing" || o.Status == "Ready"));

            if (!otherActiveOrders)
            {
                var table = await _tableRepository.GetByIdAsync(order.TableId.Value);
                if (table != null && table.Status == "Occupied")
                {
                    table.Status = "Available";
                    table.UpdatedAt = DateTime.UtcNow;
                    await _tableRepository.UpdateAsync(table);
                    _logger.LogInformation("[ORDER] 🪑 Meja #{TableNumber} kembali Available setelah pesanan {OrderNumber} dibatalkan", table.Number, order.OrderNumber);
                }
            }
        }

        await _orderRepository.UpdateAsync(order);
        _logger.LogInformation("[ORDER] ✅ Pesanan {OrderNumber} (ID: {OrderId}) berhasil dibatalkan", order.OrderNumber, order.Id);

        return ApiResponse<bool>.SuccessResult(true, "Pesanan berhasil dibatalkan");
    }

    private static OrderDto MapToOrderDto(Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            UserId = order.UserId,
            UserName = order.User?.Name ?? string.Empty,
            TableId = order.TableId,
            TableNumber = order.Table?.Number,
            OrderType = order.OrderType,
            Status = order.Status,
            TotalAmount = order.TotalAmount,
            CreatedAt = order.CreatedAt,
            Items = order.OrderItems.Select(oi => new OrderItemDto
            {
                Id = oi.Id,
                MenuId = oi.MenuId,
                MenuName = oi.Menu?.Name ?? string.Empty,
                ImageUrl = oi.Menu?.ImageUrl,
                Quantity = oi.Quantity,
                Price = oi.Price,
                Subtotal = oi.Subtotal
            }).ToList()
        };
    }
}
