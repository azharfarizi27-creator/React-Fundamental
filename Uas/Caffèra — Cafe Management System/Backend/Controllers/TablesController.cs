using Caffera.Backend.DTOs.Common;
using Caffera.Backend.DTOs.Table;
using Caffera.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Caffera.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TablesController : ControllerBase
{
    private readonly ITableService _tableService;

    public TablesController(ITableService tableService)
    {
        _tableService = tableService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<TableDto>>>> GetAll([FromQuery] string? status)
    {
        var result = await _tableService.GetAllAsync(status);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<TableDto>>> GetById(int id)
    {
        var result = await _tableService.GetByIdAsync(id);
        if (!result.Success)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<TableDto>>> Create([FromBody] CreateTableDto dto)
    {
        var result = await _tableService.CreateAsync(dto);
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<TableDto>>> Update(int id, [FromBody] UpdateTableDto dto)
    {
        var result = await _tableService.UpdateAsync(id, dto);
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPatch("{id:int}/status")]
    [Authorize(Roles = "Admin,Cashier")]
    public async Task<ActionResult<ApiResponse<TableDto>>> UpdateStatus(int id, [FromBody] UpdateTableStatusDto dto)
    {
        var result = await _tableService.UpdateStatusAsync(id, dto);
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
    {
        var result = await _tableService.DeleteAsync(id);
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}
