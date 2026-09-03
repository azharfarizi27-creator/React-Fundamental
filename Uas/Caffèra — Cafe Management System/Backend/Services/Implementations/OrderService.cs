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

    public OrderService(
        IOrderRepository orderRepository,
        IRepository<Menu> menuRepository,
        IRepository<Table> tableRepository,
        IRepository<User> userRepository)
    {
        _orderRepository = orderRepository;
        _menuRepository = menuRepository;
        _tableRepository = tableRepository;
        _userRepository = userRepository;
    }

    public async Task<ApiResponse<PagedResult<OrderDto>>> GetAllAsync(OrderFilterParams filterParams)
    {
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
        var order = await _orderRepository.GetOrderWithDetailsAsync(id);
        if (order == null)
        {
            return ApiResponse<OrderDto>.FailResult("Pesanan tidak ditemukan");
        }

        return ApiResponse<OrderDto>.SuccessResult(MapToOrderDto(order));
    }

    public async Task<ApiResponse<OrderDto>> GetByOrderNumberAsync(string orderNumber)
    {
        var order = await _orderRepository.GetOrderByNumberWithDetailsAsync(orderNumber.Trim());
        if (order == null)
        {
            return ApiResponse<OrderDto>.FailResult("Pesanan tidak ditemukan");
        }

        return ApiResponse<OrderDto>.SuccessResult(MapToOrderDto(order));
    }

    public async Task<ApiResponse<OrderDto>> CreateAsync(int userId, CreateOrderDto dto)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return ApiResponse<OrderDto>.FailResult("Kasir/Pengguna tidak valid");
        }

        Table? table = null;
        if (dto.OrderType.Equals("DineIn", StringComparison.OrdinalIgnoreCase))
        {
            if (!dto.TableId.HasValue)
            {
                return ApiResponse<OrderDto>.FailResult("Meja wajib dipilih untuk pesanan Dine In");
            }

            table = await _tableRepository.GetByIdAsync(dto.TableId.Value);
            if (table == null)
            {
                return ApiResponse<OrderDto>.FailResult("Meja yang dipilih tidak ditemukan");
            }

            // Update table status to Occupied
            table.Status = "Occupied";
            table.UpdatedAt = DateTime.UtcNow;
            await _tableRepository.UpdateAsync(table);
        }

        var menuIds = dto.Items.Select(i => i.MenuId).Distinct().ToList();
        var menus = (await _menuRepository.FindAsync(m => menuIds.Contains(m.Id))).ToDictionary(m => m.Id);

        foreach (var item in dto.Items)
        {
            if (!menus.TryGetValue(item.MenuId, out var menu))
            {
                return ApiResponse<OrderDto>.FailResult($"Menu dengan ID {item.MenuId} tidak ditemukan");
            }

            if (!menu.IsAvailable)
            {
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

        return ApiResponse<OrderDto>.SuccessResult(MapToOrderDto(fullOrder!), "Pesanan berhasil dibuat");
    }

    public async Task<ApiResponse<OrderDto>> UpdateStatusAsync(int id, UpdateOrderStatusDto dto)
    {
        var order = await _orderRepository.GetOrderWithDetailsAsync(id);
        if (order == null)
        {
            return ApiResponse<OrderDto>.FailResult("Pesanan tidak ditemukan");
        }

        var validStatuses = new[] { "Pending", "Preparing", "Ready", "Completed", "Cancelled" };
        if (!validStatuses.Contains(dto.Status, StringComparer.OrdinalIgnoreCase))
        {
            return ApiResponse<OrderDto>.FailResult("Status pesanan tidak valid");
        }

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
                }
            }
        }

        await _orderRepository.UpdateAsync(order);
        var updated = await _orderRepository.GetOrderWithDetailsAsync(id);

        return ApiResponse<OrderDto>.SuccessResult(MapToOrderDto(updated!), "Status pesanan berhasil diperbarui");
    }

    public async Task<ApiResponse<bool>> CancelOrderAsync(int id)
    {
        var order = await _orderRepository.GetOrderWithDetailsAsync(id);
        if (order == null)
        {
            return ApiResponse<bool>.FailResult("Pesanan tidak ditemukan");
        }

        if (order.Status == "Completed")
        {
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
                }
            }
        }

        await _orderRepository.UpdateAsync(order);
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
