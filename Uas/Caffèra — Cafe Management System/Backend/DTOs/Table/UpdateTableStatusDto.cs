using System.ComponentModel.DataAnnotations;

namespace Caffera.Backend.DTOs.Table;

public class UpdateTableStatusDto
{
    [Required(ErrorMessage = "Status meja wajib diisi")]
    public string Status { get; set; } = "Available"; // "Available", "Occupied", "Reserved"
}
