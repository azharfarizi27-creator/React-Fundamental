using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Caffera.Backend.Models;

[Table("Orders")]
public class Order
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(30)]
    public string OrderNumber { get; set; } = string.Empty; // "ORD-20260902-001"

    [Required]
    public int UserId { get; set; }

    [MaxLength(100)]
    public string? CustomerName { get; set; }

    public int? TableId { get; set; } // Nullable jika TakeAway

    [Required]
    [MaxLength(20)]
    public string OrderType { get; set; } = "DineIn"; // "DineIn" atau "TakeAway"

    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = "Pending"; // "Pending", "Preparing", "Ready", "Completed", "Cancelled"

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalAmount { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // Navigation Properties
    [ForeignKey("UserId")]
    public User? User { get; set; }

    [ForeignKey("TableId")]
    public Table? Table { get; set; }

    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
