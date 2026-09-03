using System.ComponentModel.DataAnnotations;

namespace Caffera.Backend.DTOs.Order;

public class UpdateOrderStatusDto
{
    [Required(ErrorMessage = "Status pesanan wajib diisi")]
    public string Status { get; set; } = string.Empty; // "Pending", "Preparing", "Ready", "Completed", "Cancelled"
}
