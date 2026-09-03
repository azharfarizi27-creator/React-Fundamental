using Caffera.Backend.DTOs.Common;
using Caffera.Backend.DTOs.Order;
using Caffera.Backend.DTOs.Sales;

namespace Caffera.Backend.Services.Interfaces;

public interface ISalesService
{
    Task<ApiResponse<PagedResult<OrderDto>>> GetSalesHistoryAsync(OrderFilterParams filterParams);
    Task<ApiResponse<SalesSummaryDto>> GetSalesSummaryAsync(DateTime? startDate, DateTime? endDate);
}
