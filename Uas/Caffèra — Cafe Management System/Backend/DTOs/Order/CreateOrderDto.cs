using System.ComponentModel.DataAnnotations;

namespace Caffera.Backend.DTOs.Order;

public class CreateOrderItemDto
{
    public int MenuId { get; set; }

    public int? Id { get; set; } // Fallback jika frontend mengirim { id: 1, ... }

    public int Quantity { get; set; }

    public int? Qty { get; set; } // Fallback jika frontend mengirim { qty: 1, ... }

    public decimal? Price { get; set; }

    public string? Notes { get; set; }

    public int EffectiveMenuId => MenuId > 0 ? MenuId : (Id ?? 0);

    public int EffectiveQuantity => Quantity > 0 ? Quantity : (Qty > 0 ? Qty.Value : 1);
}

public class CreateOrderDto
{
    public string? CustomerName { get; set; }

    public int? TableId { get; set; } // ID meja di database

    public int? TableNumber { get; set; } // Nomor meja fisik (e.g. Meja #1, #2)

    public string OrderType { get; set; } = "DineIn"; // "DineIn" atau "TakeAway"

    public List<CreateOrderItemDto>? Items { get; set; }

    public List<CreateOrderItemDto>? OrderItems { get; set; } // Fallback jika frontend mengirim orderItems

    public List<CreateOrderItemDto> GetNormalizedItems()
    {
        var rawList = (Items != null && Items.Count > 0) 
            ? Items 
            : (OrderItems ?? new List<CreateOrderItemDto>());

        return rawList
            .Where(i => i.EffectiveMenuId > 0 && i.EffectiveQuantity > 0)
            .ToList();
    }
}

