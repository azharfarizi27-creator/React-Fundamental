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
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        IRepository<User> userRepository, 
        JwtHelper jwtHelper,
        ILogger<AuthService> logger)
    {
        _userRepository = userRepository;
        _jwtHelper = jwtHelper;
        _logger = logger;
    }

    public async Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginDto loginDto)
    {
        var email = loginDto.Email?.Trim() ?? string.Empty;
        _logger.LogInformation("[AUTH] 🔑 Mencoba login untuk email: {Email}", email);

        var users = await _userRepository.FindAsync(u => u.Email.ToLower() == email.ToLower());
        var user = users.FirstOrDefault();

        if (user == null)
        {
            _logger.LogWarning("[AUTH] ⚠️ Login gagal: Akun dengan email '{Email}' tidak ditemukan di database", email);
            return ApiResponse<AuthResponseDto>.FailResult("Email atau password tidak valid");
        }

        if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
        {
            _logger.LogWarning("[AUTH] ⚠️ Login gagal: Password tidak cocok untuk user '{Email}' (ID: {UserId})", email, user.Id);
            return ApiResponse<AuthResponseDto>.FailResult("Email atau password tidak valid");
        }

        var (token, expiration) = _jwtHelper.GenerateToken(user);
        _logger.LogInformation("[AUTH] ✅ Login berhasil! User ID: {UserId}, Nama: {Name}, Role: {Role}, Token expires at: {Expiration}", 
            user.Id, user.Name, user.Role, expiration);

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
        var email = registerDto.Email.ToLower().Trim();
        _logger.LogInformation("[AUTH] 👤 Memproses pendaftaran user baru: {Email}, Role: {Role}", email, registerDto.Role);

        var existing = (await _userRepository.FindAsync(u => u.Email.ToLower() == email)).FirstOrDefault();
        if (existing != null)
        {
            _logger.LogWarning("[AUTH] ⚠️ Pendaftaran gagal: Email '{Email}' sudah terdaftar sebelumnya (User ID: {UserId})", email, existing.Id);
            return ApiResponse<UserDto>.FailResult("Email sudah terdaftar");
        }

        var user = new User
        {
            Name = registerDto.Name.Trim(),
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
            Role = registerDto.Role == "Admin" ? "Admin" : "Cashier",
            CreatedAt = DateTime.UtcNow
        };

        var created = await _userRepository.AddAsync(user);
        _logger.LogInformation("[AUTH] ✅ Pendaftaran berhasil! User baru dibuat dengan ID: {UserId}, Email: {Email}, Role: {Role}", 
            created.Id, created.Email, created.Role);

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
            _logger.LogWarning("[AUTH] ⚠️ Profil tidak ditemukan untuk User ID: {UserId}", userId);
            return ApiResponse<UserDto>.FailResult("Pengguna tidak ditemukan");
        }

        _logger.LogInformation("[AUTH] ℹ️ Mengambil profil untuk User ID: {UserId} ({Email})", userId, user.Email);

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
        _logger.LogInformation("[AUTH] 📋 Mengambil daftar semua pengguna (Admin view)");
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
