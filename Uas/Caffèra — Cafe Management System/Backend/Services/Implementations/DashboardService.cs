using Caffera.Backend.DTOs.Common;
using Caffera.Backend.DTOs.Dashboard;
using Caffera.Backend.DTOs.Order;
using Caffera.Backend.Models;
using Caffera.Backend.Repositories.Interfaces;
using Caffera.Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Caffera.Backend.Services.Implementations;

public class DashboardService : IDashboardService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IRepository<Menu> _menuRepository;
    private readonly IRepository<Table> _tableRepository;
    private readonly IRepository<OrderItem> _orderItemRepository;
    private readonly ILogger<DashboardService> _logger;

    public DashboardService(
        IOrderRepository orderRepository,
        IRepository<Menu> menuRepository,
        IRepository<Table> tableRepository,
        IRepository<OrderItem> orderItemRepository,
        ILogger<DashboardService> logger)
    {
        _orderRepository = orderRepository;
        _menuRepository = menuRepository;
        _tableRepository = tableRepository;
        _orderItemRepository = orderItemRepository;
        _logger = logger;
    }

    public async Task<ApiResponse<DashboardStatsDto>> GetDashboardStatsAsync()
    {
        _logger.LogInformation("[DASHBOARD] 📈 Mengambil statistik dashboard Caffèra");
        var today = DateTime.UtcNow.Date;

        // 1. Today's orders
        var todayOrders = await _orderRepository.Query()
            .Where(o => o.CreatedAt >= today && o.Status != "Cancelled")
            .ToListAsync();

        var todayRevenue = todayOrders.Where(o => o.Status == "Completed").Sum(o => o.TotalAmount);
        var todayOrdersCount = todayOrders.Count;

        // 2. Menu count
        var totalMenuItems = await _menuRepository.CountAsync();

        // 3. Table counts
        var availableTablesCount = await _tableRepository.CountAsync(t => t.Status == "Available");
        var occupiedTablesCount = await _tableRepository.CountAsync(t => t.Status == "Occupied");

        // 4. Recent orders (latest 5)
        var recentOrders = await _orderRepository.Query()
            .Include(o => o.User)
            .Include(o => o.Table)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Menu)
            .OrderByDescending(o => o.CreatedAt)
            .Take(5)
            .ToListAsync();

        var recentOrderDtos = recentOrders.Select(o => new OrderDto
        {
            Id = o.Id,
            OrderNumber = o.OrderNumber,
            UserId = o.UserId,
            UserName = o.User?.Name ?? string.Empty,
            TableId = o.TableId,
            TableNumber = o.Table?.Number,
            OrderType = o.OrderType,
            Status = o.Status,
            TotalAmount = o.TotalAmount,
            CreatedAt = o.CreatedAt,
            Items = o.OrderItems.Select(oi => new OrderItemDto
            {
                Id = oi.Id,
                MenuId = oi.MenuId,
                MenuName = oi.Menu?.Name ?? string.Empty,
                Quantity = oi.Quantity,
                Price = oi.Price,
                Subtotal = oi.Subtotal
            }).ToList()
        }).ToList();

        // 5. Sales last 7 days
        var sevenDaysAgo = today.AddDays(-6);
        var last7DaysOrders = await _orderRepository.Query()
            .Where(o => o.CreatedAt >= sevenDaysAgo && o.Status == "Completed")
            .ToListAsync();

        var salesLast7Days = new List<DailySalesDto>();
        for (int i = 6; i >= 0; i--)
        {
            var dayDate = today.AddDays(-i);
            var dayOrders = last7DaysOrders.Where(o => o.CreatedAt.Date == dayDate).ToList();
            salesLast7Days.Add(new DailySalesDto
            {
                Date = dayDate.ToString("yyyy-MM-dd"),
                TotalRevenue = dayOrders.Sum(o => o.TotalAmount),
                TotalOrders = dayOrders.Count
            });
        }

        // 6. Top selling menus
        var topItems = await _orderItemRepository.Query()
            .Include(oi => oi.Menu)
            .Include(oi => oi.Order)
            .Where(oi => oi.Order!.Status == "Completed")
            .GroupBy(oi => new { oi.MenuId, MenuName = oi.Menu!.Name })
            .Select(g => new TopMenuDto
            {
                MenuId = g.Key.MenuId,
                MenuName = g.Key.MenuName,
                TotalQuantitySold = g.Sum(x => x.Quantity),
                TotalRevenue = g.Sum(x => x.Subtotal)
            })
            .OrderByDescending(x => x.TotalQuantitySold)
            .Take(5)
            .ToListAsync();

        _logger.LogInformation("[DASHBOARD] ✅ Statistik siap: Omset Hari Ini = Rp {Rev:N0}, Pesanan Hari Ini = {Orders}, Meja Kosong = {Avail}/{Total}",
            todayRevenue, todayOrdersCount, availableTablesCount, availableTablesCount + occupiedTablesCount);

        var stats = new DashboardStatsDto
        {
            TodayRevenue = todayRevenue,
            TodayOrdersCount = todayOrdersCount,
            TotalMenuItems = totalMenuItems,
            AvailableTablesCount = availableTablesCount,
            OccupiedTablesCount = occupiedTablesCount,
            RecentOrders = recentOrderDtos,
            SalesLast7Days = salesLast7Days,
            TopSellingMenus = topItems
        };

        return ApiResponse<DashboardStatsDto>.SuccessResult(stats);
    }
}
