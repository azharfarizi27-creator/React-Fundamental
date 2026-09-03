using Caffera.Backend.DTOs.Auth;
using Caffera.Backend.DTOs.Common;
using Caffera.Backend.Helpers;
using Caffera.Backend.Models;
using Caffera.Backend.Repositories.Interfaces;
using Caffera.Backend.Services.Interfaces;

namespace Caffera.Backend.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly IRepository<User> _userRepository;
    private readonly JwtHelper _jwtHelper;

    public AuthService(IRepository<User> userRepository, JwtHelper jwtHelper)
    {
        _userRepository = userRepository;
        _jwtHelper = jwtHelper;
    }

    public async Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginDto loginDto)
    {
        var users = await _userRepository.FindAsync(u => u.Email.ToLower() == loginDto.Email.ToLower().Trim());
        var user = users.FirstOrDefault();

        if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
        {
            return ApiResponse<AuthResponseDto>.FailResult("Email atau password tidak valid");
        }

        var (token, expiration) = _jwtHelper.GenerateToken(user);

        var authResponse = new AuthResponseDto
        {
            Token = token,
            Expiration = expiration,
            User = new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            }
        };

        return ApiResponse<AuthResponseDto>.SuccessResult(authResponse, "Login berhasil");
    }

    public async Task<ApiResponse<UserDto>> RegisterAsync(RegisterDto registerDto)
    {
        var existing = (await _userRepository.FindAsync(u => u.Email.ToLower() == registerDto.Email.ToLower().Trim())).FirstOrDefault();
        if (existing != null)
        {
            return ApiResponse<UserDto>.FailResult("Email sudah terdaftar");
        }

        var user = new User
        {
            Name = registerDto.Name.Trim(),
            Email = registerDto.Email.ToLower().Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
            Role = registerDto.Role == "Admin" ? "Admin" : "Cashier",
            CreatedAt = DateTime.UtcNow
        };

        var created = await _userRepository.AddAsync(user);

        var userDto = new UserDto
        {
            Id = created.Id,
            Name = created.Name,
            Email = created.Email,
            Role = created.Role,
            CreatedAt = created.CreatedAt
        };

        return ApiResponse<UserDto>.SuccessResult(userDto, "Pengguna berhasil didaftarkan");
    }

    public async Task<ApiResponse<UserDto>> GetProfileAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return ApiResponse<UserDto>.FailResult("Pengguna tidak ditemukan");
        }

        var userDto = new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role,
            CreatedAt = user.CreatedAt
        };

        return ApiResponse<UserDto>.SuccessResult(userDto);
    }

    public async Task<ApiResponse<IEnumerable<UserDto>>> GetAllUsersAsync()
    {
        var users = await _userRepository.GetAllAsync();
        var dtos = users.Select(u => new UserDto
        {
            Id = u.Id,
            Name = u.Name,
            Email = u.Email,
            Role = u.Role,
            CreatedAt = u.CreatedAt
        });

        return ApiResponse<IEnumerable<UserDto>>.SuccessResult(dtos);
    }
}
