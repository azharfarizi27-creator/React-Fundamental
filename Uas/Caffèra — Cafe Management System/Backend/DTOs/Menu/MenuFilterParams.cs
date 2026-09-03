using Caffera.Backend.DTOs.Common;

namespace Caffera.Backend.DTOs.Menu;

public class MenuFilterParams : PaginationParams
{
    public int? CategoryId { get; set; }
    public bool? IsAvailable { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
}
