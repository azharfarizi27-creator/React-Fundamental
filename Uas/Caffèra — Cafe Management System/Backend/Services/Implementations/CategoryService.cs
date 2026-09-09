using Caffera.Backend.DTOs.Category;
using Caffera.Backend.DTOs.Common;
using Caffera.Backend.Models;
using Caffera.Backend.Repositories.Interfaces;
using Caffera.Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Caffera.Backend.Services.Implementations;

public class CategoryService : ICategoryService
{
    private readonly IRepository<Category> _categoryRepository;
    private readonly IRepository<Menu> _menuRepository;
    private readonly ILogger<CategoryService> _logger;

    public CategoryService(
        IRepository<Category> categoryRepository, 
        IRepository<Menu> menuRepository,
        ILogger<CategoryService> logger)
    {
        _categoryRepository = categoryRepository;
        _menuRepository = menuRepository;
        _logger = logger;
    }

    public async Task<ApiResponse<IEnumerable<CategoryDto>>> GetAllAsync(string? search = null)
    {
        _logger.LogInformation("[CATEGORY] 📋 Mengambil daftar kategori (Search: '{Search}')", search ?? "-");

        var query = _categoryRepository.Query().Include(c => c.Menus).AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.Trim().ToLower();
            query = query.Where(c => c.Name.ToLower().Contains(searchLower) || (c.Description != null && c.Description.ToLower().Contains(searchLower)));
        }

        var categories = await query.OrderBy(c => c.Name).ToListAsync();

        var dtos = categories.Select(c => new CategoryDto
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description,
            TotalMenus = c.Menus.Count,
            CreatedAt = c.CreatedAt
        });

        return ApiResponse<IEnumerable<CategoryDto>>.SuccessResult(dtos);
    }

    public async Task<ApiResponse<CategoryDto>> GetByIdAsync(int id)
    {
        _logger.LogInformation("[CATEGORY] 🔍 Mengambil detail kategori ID: {CategoryId}", id);

        var category = await _categoryRepository.Query()
            .Include(c => c.Menus)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null)
        {
            _logger.LogWarning("[CATEGORY] ⚠️ Kategori dengan ID {CategoryId} tidak ditemukan", id);
            return ApiResponse<CategoryDto>.FailResult("Kategori tidak ditemukan");
        }

        var dto = new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            TotalMenus = category.Menus.Count,
            CreatedAt = category.CreatedAt
        };

        return ApiResponse<CategoryDto>.SuccessResult(dto);
    }

    public async Task<ApiResponse<CategoryDto>> CreateAsync(CreateCategoryDto dto)
    {
        var categoryName = dto.Name.Trim();
        _logger.LogInformation("[CATEGORY] ➕ Menambahkan kategori baru: '{CategoryName}'", categoryName);

        var existing = await _categoryRepository.Query()
            .AnyAsync(c => c.Name.ToLower() == categoryName.ToLower());

        if (existing)
        {
            _logger.LogWarning("[CATEGORY] ⚠️ Gagal tambah: Kategori '{CategoryName}' sudah ada sebelumnya", categoryName);
            return ApiResponse<CategoryDto>.FailResult("Nama kategori sudah ada");
        }

        var category = new Category
        {
            Name = categoryName,
            Description = dto.Description?.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        var created = await _categoryRepository.AddAsync(category);
        _logger.LogInformation("[CATEGORY] ✅ Kategori baru '{CategoryName}' berhasil dibuat dengan ID: {CategoryId}", created.Name, created.Id);

        var resultDto = new CategoryDto
        {
            Id = created.Id,
            Name = created.Name,
            Description = created.Description,
            TotalMenus = 0,
            CreatedAt = created.CreatedAt
        };

        return ApiResponse<CategoryDto>.SuccessResult(resultDto, "Kategori berhasil ditambahkan");
    }

    public async Task<ApiResponse<CategoryDto>> UpdateAsync(int id, UpdateCategoryDto dto)
    {
        var categoryName = dto.Name.Trim();
        _logger.LogInformation("[CATEGORY] ✏️ Memperbarui kategori ID: {CategoryId} ('{CategoryName}')", id, categoryName);

        var category = await _categoryRepository.Query()
            .Include(c => c.Menus)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null)
        {
            _logger.LogWarning("[CATEGORY] ⚠️ Gagal update: Kategori ID {CategoryId} tidak ditemukan", id);
            return ApiResponse<CategoryDto>.FailResult("Kategori tidak ditemukan");
        }

        var nameExists = await _categoryRepository.Query()
            .AnyAsync(c => c.Id != id && c.Name.ToLower() == categoryName.ToLower());

        if (nameExists)
        {
            _logger.LogWarning("[CATEGORY] ⚠️ Gagal update: Nama kategori '{CategoryName}' sudah digunakan oleh kategori lain", categoryName);
            return ApiResponse<CategoryDto>.FailResult("Nama kategori sudah digunakan oleh kategori lain");
        }

        category.Name = categoryName;
        category.Description = dto.Description?.Trim();
        category.UpdatedAt = DateTime.UtcNow;

        await _categoryRepository.UpdateAsync(category);
        _logger.LogInformation("[CATEGORY] ✅ Kategori ID {CategoryId} berhasil diperbarui menjadi '{CategoryName}'", id, category.Name);

        var resultDto = new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            TotalMenus = category.Menus.Count,
            CreatedAt = category.CreatedAt
        };

        return ApiResponse<CategoryDto>.SuccessResult(resultDto, "Kategori berhasil diperbarui");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(int id)
    {
        _logger.LogInformation("[CATEGORY] 🗑️ Memproses penghapusan kategori ID: {CategoryId}", id);

        var category = await _categoryRepository.Query()
            .Include(c => c.Menus)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null)
        {
            _logger.LogWarning("[CATEGORY] ⚠️ Gagal hapus: Kategori ID {CategoryId} tidak ditemukan", id);
            return ApiResponse<bool>.FailResult("Kategori tidak ditemukan");
        }

        if (category.Menus.Any())
        {
            _logger.LogWarning("[CATEGORY] ⚠️ Hapus kategori ID {CategoryId} ('{CategoryName}') ditolak: Masih memiliki {Count} menu terkait", 
                id, category.Name, category.Menus.Count);
            return ApiResponse<bool>.FailResult("Tidak dapat menghapus kategori yang masih memiliki menu terkait. Hapus atau pindahkan menu terlebih dahulu.");
        }

        await _categoryRepository.DeleteAsync(category);
        _logger.LogInformation("[CATEGORY] ✅ Kategori ID {CategoryId} ('{CategoryName}') berhasil dihapus", id, category.Name);

        return ApiResponse<bool>.SuccessResult(true, "Kategori berhasil dihapus");
    }
}
