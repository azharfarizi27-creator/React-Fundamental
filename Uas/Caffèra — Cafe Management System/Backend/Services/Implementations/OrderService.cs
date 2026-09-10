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
                .ThenInclude(oi => oi.Menu!)
                    .ThenInclude(m => m.Category)
            .AsQueryable();

        // 1. Search filter (OrderNumber, Customer/User, Table)
        if (!string.IsNullOrWhiteSpace(filterParams.Search))
        {
            var search = filterParams.Search.Trim().ToLower();
            query = query.Where(o => o.OrderNumber.ToLower().Contains(search) || 
                                     (o.User != null && o.User.Name.ToLower().Contains(search)) ||
                                     (o.CustomerName != null && o.CustomerName.ToLower().Contains(search)));
        }

        // 2. Status filter
        if (!string.IsNullOrWhiteSpace(filterParams.Status))
        {
            var rawStatus = filterParams.Status.Trim();
            if (!rawStatus.Equals("all", StringComparison.OrdinalIgnoreCase))
            {
                if (rawStatus.Equals("active", StringComparison.OrdinalIgnoreCase) ||
                    rawStatus.Equals("kitchen", StringComparison.OrdinalIgnoreCase) ||
                    rawStatus.Equals("inprogress", StringComparison.OrdinalIgnoreCase) ||
                    rawStatus.Equals("in_progress", StringComparison.OrdinalIgnoreCase))
                {
                    query = query.Where(o => o.Status == "Pending" || o.Status == "Preparing" || o.Status == "Ready");
                }
                else
                {
                    var statuses = rawStatus.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                                            .Select(s => s.ToLower())
                                            .ToList();
                    if (statuses.Count == 1)
                    {
                        var singleStatus = statuses[0];
                        query = query.Where(o => o.Status.ToLower() == singleStatus);
                    }
                    else if (statuses.Count > 1)
                    {
                        query = query.Where(o => statuses.Contains(o.Status.ToLower()));
                    }
                }
            }
        }

        // 3. OrderType filter
        if (!string.IsNullOrWhiteSpace(filterParams.OrderType) && !filterParams.OrderType.Equals("all", StringComparison.OrdinalIgnoreCase))
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
        var normalizedItems = dto.GetNormalizedItems();
        _logger.LogInformation("[ORDER] 🛒 Membuat pesanan baru oleh User ID: {UserId}, Tipe: {OrderType}, Jumlah Menu: {Count}", 
            userId, dto.OrderType, normalizedItems.Count);

        if (normalizedItems.Count == 0)
        {
            return ApiResponse<OrderDto>.FailResult("Pesanan harus memiliki minimal 1 item menu yang valid");
        }

        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            _logger.LogWarning("[ORDER] ⚠️ Gagal membuat pesanan: User ID {UserId} tidak ditemukan di database", userId);
            return ApiResponse<OrderDto>.FailResult("Kasir/Pengguna tidak valid");
        }

        Table? table = null;
        if (dto.OrderType.Equals("DineIn", StringComparison.OrdinalIgnoreCase))
        {
            if (dto.TableId.HasValue && dto.TableId.Value > 0)
            {
                table = await _tableRepository.GetByIdAsync(dto.TableId.Value);
            }
            if (table == null && dto.TableNumber.HasValue && dto.TableNumber.Value > 0)
            {
                var tables = await _tableRepository.FindAsync(t => t.Number == dto.TableNumber.Value);
                table = tables.FirstOrDefault();
            }
            if (table == null && dto.TableId.HasValue && dto.TableId.Value > 0)
            {
                var tables = await _tableRepository.FindAsync(t => t.Number == dto.TableId.Value);
                table = tables.FirstOrDefault();
            }
            if (table == null && dto.TableNumber.HasValue && dto.TableNumber.Value > 0)
            {
                table = await _tableRepository.GetByIdAsync(dto.TableNumber.Value);
            }

            if (table != null)
            {
                dto.TableId = table.Id;
                table.Status = "Occupied";
                table.UpdatedAt = DateTime.UtcNow;
                await _tableRepository.UpdateAsync(table);
                _logger.LogInformation("[ORDER] 🪑 Status Meja #{TableNumber} diubah menjadi Occupied", table.Number);
            }
        }

        var menuIds = normalizedItems.Select(i => i.EffectiveMenuId).Distinct().ToList();
        var menus = (await _menuRepository.FindAsync(m => menuIds.Contains(m.Id))).ToDictionary(m => m.Id);

        foreach (var item in normalizedItems)
        {
            if (!menus.TryGetValue(item.EffectiveMenuId, out var menu))
            {
                _logger.LogWarning("[ORDER] ⚠️ Gagal membuat pesanan: Menu ID {MenuId} tidak ditemukan", item.EffectiveMenuId);
                return ApiResponse<OrderDto>.FailResult($"Menu dengan ID {item.EffectiveMenuId} tidak ditemukan");
            }

            if (!menu.IsAvailable)
            {
                _logger.LogWarning("[ORDER] ⚠️ Gagal membuat pesanan: Menu '{MenuName}' (ID: {MenuId}) sedang Tidak Tersedia", menu.Name, menu.Id);
                return ApiResponse<OrderDto>.FailResult($"Menu '{menu.Name}' saat ini sedang tidak tersedia");
            }
        }

        var orderNumber = await _orderRepository.GenerateOrderNumberAsync();
        var customerName = !string.IsNullOrWhiteSpace(dto.CustomerName)
            ? dto.CustomerName.Trim()
            : (table != null ? $"Tamu Meja #{table.Number}" : user.Name);

        var order = new Order
        {
            OrderNumber = orderNumber,
            UserId = userId,
            CustomerName = customerName,
            TableId = dto.OrderType.Equals("DineIn", StringComparison.OrdinalIgnoreCase) ? (table?.Id ?? dto.TableId) : null,
            OrderType = dto.OrderType.Equals("TakeAway", StringComparison.OrdinalIgnoreCase) ? "TakeAway" : "DineIn",
            Status = "Pending",
            CreatedAt = DateTime.UtcNow,
            OrderItems = new List<OrderItem>()
        };

        decimal totalAmount = 0;
        foreach (var item in normalizedItems)
        {
            var menu = menus[item.EffectiveMenuId];
            var qty = item.EffectiveQuantity;
            var subtotal = menu.Price * qty;
            totalAmount += subtotal;

            order.OrderItems.Add(new OrderItem
            {
                MenuId = menu.Id,
                Quantity = qty,
                Price = menu.Price, // Snapshot price!
                Subtotal = subtotal
            });
        }

        order.TotalAmount = totalAmount;

        var createdOrder = await _orderRepository.AddAsync(order);
        var fullOrder = await _orderRepository.GetOrderWithDetailsAsync(createdOrder.Id);

        _logger.LogInformation("[ORDER] ✅ Pesanan berhasil dibuat! No: {OrderNumber} (ID: {OrderId}), Total: Rp {Total:N0}, Kasir: {Cashier}",
            order.OrderNumber, createdOrder.Id, order.TotalAmount, user.Name);

        var orderDto = MapToOrderDto(fullOrder!);
        return ApiResponse<OrderDto>.SuccessResult(orderDto, "Pesanan berhasil dibuat");
    }

    public async Task<ApiResponse<OrderDto>> CreateGuestOrderAsync(CreateOrderDto dto)
    {
        var normalizedItems = dto.GetNormalizedItems();
        _logger.LogInformation("[ORDER] 📱 Tamu membuat pesanan Self-Order via QR Meja #{TableNumber} / TableId {TableId}. Customer: '{Customer}', Items Count: {Count}", 
            dto.TableNumber, dto.TableId, dto.CustomerName ?? "Tamu", normalizedItems.Count);

        if (normalizedItems.Count == 0)
        {
            return ApiResponse<OrderDto>.FailResult("Pesanan harus memiliki minimal 1 item menu yang valid");
        }

        // Cari akun sistem / admin default sebagai penanggung jawab order
        var users = await _userRepository.GetAllAsync();
        var defaultUser = users.FirstOrDefault(u => u.Role == "Admin") ?? users.FirstOrDefault();

        if (defaultUser == null)
        {
            _logger.LogWarning("[ORDER] ⚠️ Gagal membuat pesanan guest: Tidak ada user default di database");
            return ApiResponse<OrderDto>.FailResult("Sistem kasir sedang tidak siap menerima pesanan");
        }

        Table? table = null;
        if (dto.OrderType.Equals("DineIn", StringComparison.OrdinalIgnoreCase))
        {
            if (dto.TableId.HasValue && dto.TableId.Value > 0)
            {
                table = await _tableRepository.GetByIdAsync(dto.TableId.Value);
            }
            if (table == null && dto.TableNumber.HasValue && dto.TableNumber.Value > 0)
            {
                var tables = await _tableRepository.FindAsync(t => t.Number == dto.TableNumber.Value);
                table = tables.FirstOrDefault();
            }
            if (table == null && dto.TableId.HasValue && dto.TableId.Value > 0)
            {
                var tables = await _tableRepository.FindAsync(t => t.Number == dto.TableId.Value);
                table = tables.FirstOrDefault();
            }
            if (table == null && dto.TableNumber.HasValue && dto.TableNumber.Value > 0)
            {
                table = await _tableRepository.GetByIdAsync(dto.TableNumber.Value);
            }

            if (table == null)
            {
                // Ambil meja pertama jika tidak ditemukan nomor meja spesifik
                var allTables = await _tableRepository.GetAllAsync();
                table = allTables.FirstOrDefault();
            }

            if (table != null)
            {
                dto.TableId = table.Id;
                table.Status = "Occupied";
                table.UpdatedAt = DateTime.UtcNow;
                await _tableRepository.UpdateAsync(table);
                _logger.LogInformation("[ORDER] 🪑 Status Meja #{TableNumber} diubah menjadi Occupied oleh Guest Self-Order", table.Number);
            }
        }

        var menuIds = normalizedItems.Select(i => i.EffectiveMenuId).Distinct().ToList();
        var menus = (await _menuRepository.FindAsync(m => menuIds.Contains(m.Id))).ToDictionary(m => m.Id);

        foreach (var item in normalizedItems)
        {
            if (!menus.TryGetValue(item.EffectiveMenuId, out var menu))
            {
                return ApiResponse<OrderDto>.FailResult($"Menu dengan ID {item.EffectiveMenuId} tidak ditemukan");
            }

            if (!menu.IsAvailable)
            {
                return ApiResponse<OrderDto>.FailResult($"Menu '{menu.Name}' saat ini sedang tidak tersedia");
            }
        }

        var orderNumber = await _orderRepository.GenerateOrderNumberAsync();
        var customerName = !string.IsNullOrWhiteSpace(dto.CustomerName)
            ? dto.CustomerName.Trim()
            : (table != null ? $"Tamu Meja #{table.Number}" : "Tamu");

        var order = new Order
        {
            OrderNumber = orderNumber,
            UserId = defaultUser.Id,
            CustomerName = customerName,
            TableId = dto.OrderType.Equals("DineIn", StringComparison.OrdinalIgnoreCase) ? (table?.Id ?? dto.TableId) : null,
            OrderType = dto.OrderType.Equals("TakeAway", StringComparison.OrdinalIgnoreCase) ? "TakeAway" : "DineIn",
            Status = "Pending",
            CreatedAt = DateTime.UtcNow,
            OrderItems = new List<OrderItem>()
        };

        decimal totalAmount = 0;
        foreach (var item in normalizedItems)
        {
            var menu = menus[item.EffectiveMenuId];
            var qty = item.EffectiveQuantity;
            var subtotal = menu.Price * qty;
            totalAmount += subtotal;

            order.OrderItems.Add(new OrderItem
            {
                MenuId = menu.Id,
                Quantity = qty,
                Price = menu.Price,
                Subtotal = subtotal
            });
        }

        order.TotalAmount = totalAmount;

        var createdOrder = await _orderRepository.AddAsync(order);
        var fullOrder = await _orderRepository.GetOrderWithDetailsAsync(createdOrder.Id);

        _logger.LogInformation("[ORDER] ✅ Pesanan Self-Order berhasil dibuat! No: {OrderNumber}, Meja: #{Table}, Total: Rp {Total:N0}, Tamu: '{Customer}'",
            order.OrderNumber, table?.Number, order.TotalAmount, customerName);

        var orderDto = MapToOrderDto(fullOrder!);
        return ApiResponse<OrderDto>.SuccessResult(orderDto, "Pesanan berhasil dikirim ke Barista & Dapur");
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
        var customer = !string.IsNullOrWhiteSpace(order.CustomerName)
            ? order.CustomerName
            : (order.Table != null ? $"Tamu Meja #{order.Table.Number}" : (order.User?.Name ?? "Tamu"));

        return new OrderDto
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            UserId = order.UserId,
            UserName = order.User?.Name ?? string.Empty,
            CustomerName = customer,
            TableId = order.TableId,
            TableNumber = order.Table?.Number,
            OrderType = order.OrderType,
            Status = order.Status,
            TotalAmount = order.TotalAmount,
            CreatedAt = order.CreatedAt,
            UpdatedAt = order.UpdatedAt,
            Items = order.OrderItems.Select(oi => new OrderItemDto
            {
                Id = oi.Id,
                MenuId = oi.MenuId,
                MenuName = oi.Menu?.Name ?? string.Empty,
                ImageUrl = oi.Menu?.ImageUrl,
                Quantity = oi.Quantity,
                Price = oi.Price,
                Subtotal = oi.Subtotal,
                Menu = oi.Menu != null ? new DTOs.Menu.MenuDto
                {
                    Id = oi.Menu.Id,
                    CategoryId = oi.Menu.CategoryId,
                    CategoryName = oi.Menu.Category?.Name ?? string.Empty,
                    Name = oi.Menu.Name,
                    Description = oi.Menu.Description,
                    Price = oi.Menu.Price,
                    ImageUrl = oi.Menu.ImageUrl,
                    IsAvailable = oi.Menu.IsAvailable,
                    CreatedAt = oi.Menu.CreatedAt,
                    UpdatedAt = oi.Menu.UpdatedAt
                } : null
            }).ToList()
        };
    }
}

