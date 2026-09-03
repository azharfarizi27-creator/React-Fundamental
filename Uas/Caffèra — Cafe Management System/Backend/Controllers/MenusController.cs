using Caffera.Backend.DTOs.Common;
using Caffera.Backend.DTOs.Menu;
using Caffera.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Caffera.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MenusController : ControllerBase
{
    private readonly IMenuService _menuService;

    public MenusController(IMenuService menuService)
    {
        _menuService = menuService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<MenuDto>>>> GetAll([FromQuery] MenuFilterParams filterParams)
    {
        var result = await _menuService.GetAllAsync(filterParams);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<MenuDto>>> GetById(int id)
    {
        var result = await _menuService.GetByIdAsync(id);
        if (!result.Success)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<MenuDto>>> Create([FromBody] CreateMenuDto dto)
    {
        var result = await _menuService.CreateAsync(dto);
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<MenuDto>>> Update(int id, [FromBody] UpdateMenuDto dto)
    {
        var result = await _menuService.UpdateAsync(id, dto);
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
        var result = await _menuService.DeleteAsync(id);
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPatch("{id:int}/toggle-availability")]
    [Authorize(Roles = "Admin,Cashier")]
    public async Task<ActionResult<ApiResponse<bool>>> ToggleAvailability(int id)
    {
        var result = await _menuService.ToggleAvailabilityAsync(id);
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}
