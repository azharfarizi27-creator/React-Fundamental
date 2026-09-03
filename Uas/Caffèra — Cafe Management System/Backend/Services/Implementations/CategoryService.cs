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

    public CategoryService(IRepository<Category> categoryRepository, IRepository<Menu> menuRepository)
    {
        _categoryRepository = categoryRepository;
        _menuRepository = menuRepository;
    }

    public async Task<ApiResponse<IEnumerable<CategoryDto>>> GetAllAsync(string? search = null)
    {
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
        var category = await _categoryRepository.Query()
            .Include(c => c.Menus)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null)
        {
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
        var existing = await _categoryRepository.Query()
            .AnyAsync(c => c.Name.ToLower() == dto.Name.Trim().ToLower());

        if (existing)
        {
            return ApiResponse<CategoryDto>.FailResult("Nama kategori sudah ada");
        }

        var category = new Category
        {
            Name = dto.Name.Trim(),
            Description = dto.Description?.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        var created = await _categoryRepository.AddAsync(category);

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
        var category = await _categoryRepository.Query()
            .Include(c => c.Menus)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null)
        {
            return ApiResponse<CategoryDto>.FailResult("Kategori tidak ditemukan");
        }

        var nameExists = await _categoryRepository.Query()
            .AnyAsync(c => c.Id != id && c.Name.ToLower() == dto.Name.Trim().ToLower());

        if (nameExists)
        {
            return ApiResponse<CategoryDto>.FailResult("Nama kategori sudah digunakan oleh kategori lain");
        }

        category.Name = dto.Name.Trim();
        category.Description = dto.Description?.Trim();
        category.UpdatedAt = DateTime.UtcNow;

        await _categoryRepository.UpdateAsync(category);

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
        var category = await _categoryRepository.Query()
            .Include(c => c.Menus)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null)
        {
            return ApiResponse<bool>.FailResult("Kategori tidak ditemukan");
        }

        if (category.Menus.Any())
        {
            return ApiResponse<bool>.FailResult("Tidak dapat menghapus kategori yang masih memiliki menu terkait. Hapus atau pindahkan menu terlebih dahulu.");
        }

        await _categoryRepository.DeleteAsync(category);
        return ApiResponse<bool>.SuccessResult(true, "Kategori berhasil dihapus");
    }
}
