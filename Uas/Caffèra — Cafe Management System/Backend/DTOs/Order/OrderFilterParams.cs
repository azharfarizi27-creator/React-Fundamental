using Caffera.Backend.DTOs.Common;

namespace Caffera.Backend.DTOs.Order;

public class OrderFilterParams : PaginationParams
{
    public string? Status { get; set; }
    public string? OrderType { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}
