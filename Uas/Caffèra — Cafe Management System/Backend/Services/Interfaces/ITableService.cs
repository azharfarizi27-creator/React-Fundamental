using Caffera.Backend.DTOs.Common;
using Caffera.Backend.DTOs.Table;

namespace Caffera.Backend.Services.Interfaces;

public interface ITableService
{
    Task<ApiResponse<IEnumerable<TableDto>>> GetAllAsync(string? status = null);
    Task<ApiResponse<TableDto>> GetByIdAsync(int id);
    Task<ApiResponse<TableDto>> CreateAsync(CreateTableDto dto);
    Task<ApiResponse<TableDto>> UpdateAsync(int id, UpdateTableDto dto);
    Task<ApiResponse<TableDto>> UpdateStatusAsync(int id, UpdateTableStatusDto dto);
    Task<ApiResponse<bool>> DeleteAsync(int id);
}
