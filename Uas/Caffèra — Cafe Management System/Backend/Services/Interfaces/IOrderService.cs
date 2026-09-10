using Caffera.Backend.DTOs.Common;
using Caffera.Backend.DTOs.Order;

namespace Caffera.Backend.Services.Interfaces;

public interface IOrderService
{
    Task<ApiResponse<PagedResult<OrderDto>>> GetAllAsync(OrderFilterParams filterParams);
    Task<ApiResponse<OrderDto>> GetByIdAsync(int id);
    Task<ApiResponse<OrderDto>> GetByOrderNumberAsync(string orderNumber);
    Task<ApiResponse<OrderDto>> CreateAsync(int userId, CreateOrderDto dto);
    Task<ApiResponse<OrderDto>> CreateGuestOrderAsync(CreateOrderDto dto);
    Task<ApiResponse<OrderDto>> UpdateStatusAsync(int id, UpdateOrderStatusDto dto);
    Task<ApiResponse<bool>> CancelOrderAsync(int id);
}
