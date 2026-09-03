using System.ComponentModel.DataAnnotations;

namespace Caffera.Backend.DTOs.Table;

public class UpdateTableDto
{
    [Required(ErrorMessage = "Nomor meja wajib diisi")]
    [Range(1, 1000, ErrorMessage = "Nomor meja minimal 1")]
    public int Number { get; set; }

    [Required(ErrorMessage = "Kapasitas meja wajib diisi")]
    [Range(1, 50, ErrorMessage = "Kapasitas harus antara 1 sampai 50")]
    public int Capacity { get; set; }

    [Required]
    public string Status { get; set; } = "Available";
}
