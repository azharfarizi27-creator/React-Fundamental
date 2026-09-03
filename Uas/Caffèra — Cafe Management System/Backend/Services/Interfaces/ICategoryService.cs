using Caffera.Backend.DTOs.Category;
using Caffera.Backend.DTOs.Common;

namespace Caffera.Backend.Services.Interfaces;

public interface ICategoryService
{
    Task<ApiResponse<IEnumerable<CategoryDto>>> GetAllAsync(string? search = null);
    Task<ApiResponse<CategoryDto>> GetByIdAsync(int id);
    Task<ApiResponse<CategoryDto>> CreateAsync(CreateCategoryDto dto);
    Task<ApiResponse<CategoryDto>> UpdateAsync(int id, UpdateCategoryDto dto);
    Task<ApiResponse<bool>> DeleteAsync(int id);
}
