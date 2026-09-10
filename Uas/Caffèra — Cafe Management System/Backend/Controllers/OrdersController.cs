using System.Security.Claims;
using Caffera.Backend.DTOs.Common;
using Caffera.Backend.DTOs.Order;
using Caffera.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Caffera.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<PagedResult<OrderDto>>>> GetAll([FromQuery] OrderFilterParams filterParams)
    {
        var result = await _orderService.GetAllAsync(filterParams);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<OrderDto>>> GetById(int id)
    {
        var result = await _orderService.GetByIdAsync(id);
        if (!result.Success)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    [HttpGet("number/{orderNumber}")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<OrderDto>>> GetByOrderNumber(string orderNumber)
    {
        var result = await _orderService.GetByOrderNumberAsync(orderNumber);
        if (!result.Success)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<OrderDto>>> Create([FromBody] CreateOrderDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!string.IsNullOrEmpty(userIdClaim) && int.TryParse(userIdClaim, out var userId))
        {
            var authResult = await _orderService.CreateAsync(userId, dto);
            if (!authResult.Success)
            {
                return BadRequest(authResult);
            }

            return CreatedAtAction(nameof(GetById), new { id = authResult.Data!.Id }, authResult);
        }

        // Jika tidak ada token (Guest / QR Code order), otomatis alihkan ke CreateGuestOrder
        var guestResult = await _orderService.CreateGuestOrderAsync(dto);
        if (!guestResult.Success)
        {
            return BadRequest(guestResult);
        }

        return CreatedAtAction(nameof(GetById), new { id = guestResult.Data!.Id }, guestResult);
    }

    [HttpPost("guest")]
    [HttpPost("/api/orders/guest")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<OrderDto>>> CreateGuestOrder([FromBody] CreateOrderDto dto)
    {
        var result = await _orderService.CreateGuestOrderAsync(dto);
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result);
    }


    [HttpPatch("{id:int}/status")]
    public async Task<ActionResult<ApiResponse<OrderDto>>> UpdateStatus(int id, [FromBody] UpdateOrderStatusDto dto)
    {
        var result = await _orderService.UpdateStatusAsync(id, dto);
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpDelete("{id:int}/cancel")]
    public async Task<ActionResult<ApiResponse<bool>>> Cancel(int id)
    {
        var result = await _orderService.CancelOrderAsync(id);
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}
