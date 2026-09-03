using System.ComponentModel.DataAnnotations;

namespace Caffera.Backend.DTOs.Menu;

public class CreateMenuDto
{
    [Required(ErrorMessage = "Kategori wajib dipilih")]
    public int CategoryId { get; set; }

    [Required(ErrorMessage = "Nama menu wajib diisi")]
    [MaxLength(150, ErrorMessage = "Nama menu maksimal 150 karakter")]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500, ErrorMessage = "Deskripsi maksimal 500 karakter")]
    public string? Description { get; set; }

    [Required(ErrorMessage = "Harga wajib diisi")]
    [Range(0.01, 100000000, ErrorMessage = "Harga harus lebih besar dari 0")]
    public decimal Price { get; set; }

    [MaxLength(500, ErrorMessage = "URL gambar maksimal 500 karakter")]
    public string? ImageUrl { get; set; }

    public bool IsAvailable { get; set; } = true;
}
