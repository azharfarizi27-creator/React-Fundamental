using Caffera.Backend.DTOs.Menu;

namespace Caffera.Backend.DTOs.Order;

public class OrderItemDto
{
    public int Id { get; set; }
    public int MenuId { get; set; }
    public string MenuName { get; set; } = string.Empty;
    public string? Name => MenuName; // Alias untuk frontend yang mengakses item.name
    public string? ImageUrl { get; set; }
    public int Quantity { get; set; }
    public int Qty => Quantity; // Alias untuk frontend yang mengakses item.qty
    public decimal Price { get; set; }
    public decimal Subtotal { get; set; }
    
    // Nested Menu object untuk frontend yang mengakses item.menu?.name
    public MenuDto? Menu { get; set; }
}

