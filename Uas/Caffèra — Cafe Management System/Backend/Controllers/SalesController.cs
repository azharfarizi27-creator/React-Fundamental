using Caffera.Backend.DTOs.Common;
using Caffera.Backend.DTOs.Order;
using Caffera.Backend.DTOs.Sales;
using Caffera.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Caffera.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SalesController : ControllerBase
{
    private readonly ISalesService _salesService;

    public SalesController(ISalesService salesService)
    {
        _salesService = salesService;
    }

    [HttpGet("history")]
    public async Task<ActionResult<ApiResponse<PagedResult<OrderDto>>>> GetHistory([FromQuery] OrderFilterParams filterParams)
    {
        var result = await _salesService.GetSalesHistoryAsync(filterParams);
        return Ok(result);
    }

    [HttpGet("summary")]
    public async Task<ActionResult<ApiResponse<SalesSummaryDto>>> GetSummary(
        [FromQuery] DateTime? startDate, 
        [FromQuery] DateTime? endDate)
    {
        var result = await _salesService.GetSalesSummaryAsync(startDate, endDate);
        return Ok(result);
    }
}
