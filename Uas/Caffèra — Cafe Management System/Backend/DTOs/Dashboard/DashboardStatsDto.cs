using Caffera.Backend.DTOs.Order;

namespace Caffera.Backend.DTOs.Dashboard;

public class DailySalesDto
{
    public string Date { get; set; } = string.Empty;
    public decimal TotalRevenue { get; set; }
    public int TotalOrders { get; set; }
}

public class TopMenuDto
{
    public int MenuId { get; set; }
    public string MenuName { get; set; } = string.Empty;
    public int TotalQuantitySold { get; set; }
    public decimal TotalRevenue { get; set; }
}

public class DashboardStatsDto
{
    public decimal TodayRevenue { get; set; }
    public int TodayOrdersCount { get; set; }
    public int TotalMenuItems { get; set; }
    public int AvailableTablesCount { get; set; }
    public int OccupiedTablesCount { get; set; }
    public List<OrderDto> RecentOrders { get; set; } = new();
    public List<DailySalesDto> SalesLast7Days { get; set; } = new();
    public List<TopMenuDto> TopSellingMenus { get; set; } = new();
}
