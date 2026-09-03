namespace Caffera.Backend.DTOs.Order;

public class OrderItemDto
{
    public int Id { get; set; }
    public int MenuId { get; set; }
    public string MenuName { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public decimal Subtotal { get; set; }
}
