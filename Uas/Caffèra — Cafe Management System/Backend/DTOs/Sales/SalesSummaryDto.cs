namespace Caffera.Backend.DTOs.Sales;

public class SalesSummaryDto
{
    public decimal TotalRevenue { get; set; }
    public int TotalOrders { get; set; }
    public int TotalItemsSold { get; set; }
    public decimal AverageOrderValue { get; set; }
}
