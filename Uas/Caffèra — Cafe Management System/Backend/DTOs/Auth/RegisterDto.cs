using System.ComponentModel.DataAnnotations;

namespace Caffera.Backend.DTOs.Auth;

public class RegisterDto
{
    [Required(ErrorMessage = "Nama wajib diisi")]
    [MaxLength(100, ErrorMessage = "Nama maksimal 100 karakter")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email wajib diisi")]
    [EmailAddress(ErrorMessage = "Format email tidak valid")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password wajib diisi")]
    [MinLength(6, ErrorMessage = "Password minimal 6 karakter")]
    public string Password { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = "Cashier"; // "Admin" atau "Cashier"
}
