using Caffera.Backend.DTOs.Common;
using Caffera.Backend.DTOs.Menu;

namespace Caffera.Backend.Services.Interfaces;

public interface IMenuService
{
    Task<ApiResponse<PagedResult<MenuDto>>> GetAllAsync(MenuFilterParams filterParams);
    Task<ApiResponse<MenuDto>> GetByIdAsync(int id);
    Task<ApiResponse<MenuDto>> CreateAsync(CreateMenuDto dto);
    Task<ApiResponse<MenuDto>> UpdateAsync(int id, UpdateMenuDto dto);
    Task<ApiResponse<bool>> DeleteAsync(int id);
    Task<ApiResponse<bool>> ToggleAvailabilityAsync(int id);
}
