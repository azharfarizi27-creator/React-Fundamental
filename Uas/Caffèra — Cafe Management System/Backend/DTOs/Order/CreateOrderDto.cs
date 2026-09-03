using System.ComponentModel.DataAnnotations;

namespace Caffera.Backend.DTOs.Order;

public class CreateOrderItemDto
{
    [Required(ErrorMessage = "Menu ID wajib diisi")]
    public int MenuId { get; set; }

    [Required(ErrorMessage = "Jumlah pesanan wajib diisi")]
    [Range(1, 100, ErrorMessage = "Jumlah pesanan minimal 1 dan maksimal 100")]
    public int Quantity { get; set; }
}

public class CreateOrderDto
{
    public int? TableId { get; set; } // Wajib jika DineIn

    [Required(ErrorMessage = "Tipe pesanan wajib diisi")]
    public string OrderType { get; set; } = "DineIn"; // "DineIn" atau "TakeAway"

    [Required(ErrorMessage = "Pesanan harus memiliki minimal 1 item menu")]
    [MinLength(1, ErrorMessage = "Pesanan harus memiliki minimal 1 item menu")]
    public List<CreateOrderItemDto> Items { get; set; } = new();
}
