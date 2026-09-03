using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Caffera.Backend.Models;

[Table("Tables")]
public class Table
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int Number { get; set; }

    [Required]
    public int Capacity { get; set; }

    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = "Available"; // "Available", "Occupied", "Reserved"

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // Navigation Property
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}
