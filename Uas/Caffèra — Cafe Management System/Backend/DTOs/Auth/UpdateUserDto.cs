using System.ComponentModel.DataAnnotations;

namespace Caffera.Backend.DTOs.Auth;

public class UpdateUserDto
{
    [MaxLength(100, ErrorMessage = "Nama maksimal 100 karakter")]
    public string? Name { get; set; }

    public string? Role { get; set; } // "Admin", "Cashier", "Kitchen"

    [MinLength(6, ErrorMessage = "Password minimal 6 karakter jika ingin diubah")]
    public string? Password { get; set; }
}
