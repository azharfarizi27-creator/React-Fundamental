using Caffera.Backend.DTOs.Auth;
using Caffera.Backend.DTOs.Common;

namespace Caffera.Backend.Services.Interfaces;

public interface IAuthService
{
    Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginDto loginDto);
    Task<ApiResponse<UserDto>> RegisterAsync(RegisterDto registerDto);
    Task<ApiResponse<UserDto>> GetProfileAsync(int userId);
    Task<ApiResponse<IEnumerable<UserDto>>> GetAllUsersAsync();
    Task<ApiResponse<UserDto>> UpdateUserAsync(int id, UpdateUserDto updateDto);
    Task<ApiResponse<bool>> DeleteUserAsync(int id);
}
