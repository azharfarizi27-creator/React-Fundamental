using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Caffera.Backend.Models;

[Table("OrderItems")]
public class OrderItem
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int OrderId { get; set; }

    [Required]
    public int MenuId { get; set; }

    [Required]
    public int Quantity { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; } // Snapshot harga saat order dibuat

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Subtotal { get; set; }

    // Navigation Properties
    [ForeignKey("OrderId")]
    public Order? Order { get; set; }

    [ForeignKey("MenuId")]
    public Menu? Menu { get; set; }
}
