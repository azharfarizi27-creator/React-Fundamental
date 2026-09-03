using System.ComponentModel.DataAnnotations;

namespace Caffera.Backend.DTOs.Category;

public class UpdateCategoryDto
{
    [Required(ErrorMessage = "Nama kategori wajib diisi")]
    [MaxLength(100, ErrorMessage = "Nama kategori maksimal 100 karakter")]
    public string Name { get; set; } = string.Empty;

    [MaxLength(255, ErrorMessage = "Deskripsi maksimal 255 karakter")]
    public string? Description { get; set; }
}
