using Caffera.Backend.DTOs.Common;
using Caffera.Backend.DTOs.Menu;
using Caffera.Backend.Models;
using Caffera.Backend.Repositories.Interfaces;
using Caffera.Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Caffera.Backend.Services.Implementations;

public class MenuService : IMenuService
{
    private readonly IRepository<Menu> _menuRepository;
    private readonly IRepository<Category> _categoryRepository;
    private readonly IRepository<OrderItem> _orderItemRepository;

    public MenuService(
        IRepository<Menu> menuRepository, 
        IRepository<Category> categoryRepository,
        IRepository<OrderItem> orderItemRepository)
    {
        _menuRepository = menuRepository;
        _categoryRepository = categoryRepository;
        _orderItemRepository = orderItemRepository;
    }

    public async Task<ApiResponse<PagedResult<MenuDto>>> GetAllAsync(MenuFilterParams filterParams)
    {
        var query = _menuRepository.Query().Include(m => m.Category).AsQueryable();

        // 1. Search filter
        if (!string.IsNullOrWhiteSpace(filterParams.Search))
        {
            var search = filterParams.Search.Trim().ToLower();
            query = query.Where(m => m.Name.ToLower().Contains(search) || 
                                     (m.Description != null && m.Description.ToLower().Contains(search)));
        }

        // 2. Category filter
        if (filterParams.CategoryId.HasValue && filterParams.CategoryId.Value > 0)
        {
            query = query.Where(m => m.CategoryId == filterParams.CategoryId.Value);
        }

        // 3. Availability filter
        if (filterParams.IsAvailable.HasValue)
        {
            query = query.Where(m => m.IsAvailable == filterParams.IsAvailable.Value);
        }

        // 4. Min/Max price filter
        if (filterParams.MinPrice.HasValue)
        {
            query = query.Where(m => m.Price >= filterParams.MinPrice.Value);
        }

        if (filterParams.MaxPrice.HasValue)
        {
            query = query.Where(m => m.Price <= filterParams.MaxPrice.Value);
        }

        // 5. Total count before pagination
        var totalCount = await query.CountAsync();

        // 6. Sorting
        query = filterParams.SortBy?.ToLower() switch
        {
            "price" => filterParams.IsAscending ? query.OrderBy(m => m.Price) : query.OrderByDescending(m => m.Price),
            "name" => filterParams.IsAscending ? query.OrderBy(m => m.Name) : query.OrderByDescending(m => m.Name),
            "createdat" => filterParams.IsAscending ? query.OrderBy(m => m.CreatedAt) : query.OrderByDescending(m => m.CreatedAt),
            _ => query.OrderByDescending(m => m.CreatedAt)
        };

        // 7. Pagination
        var skip = (filterParams.PageNumber - 1) * filterParams.PageSize;
        var items = await query.Skip(skip).Take(filterParams.PageSize).ToListAsync();

        var dtos = items.Select(m => new MenuDto
        {
            Id = m.Id,
            CategoryId = m.CategoryId,
            CategoryName = m.Category?.Name ?? string.Empty,
            Name = m.Name,
            Description = m.Description,
            Price = m.Price,
            ImageUrl = m.ImageUrl,
            IsAvailable = m.IsAvailable,
            CreatedAt = m.CreatedAt
        });

        var pagedResult = new PagedResult<MenuDto>
        {
            Items = dtos,
            PageNumber = filterParams.PageNumber,
            PageSize = filterParams.PageSize,
            TotalCount = totalCount
        };

        return ApiResponse<PagedResult<MenuDto>>.SuccessResult(pagedResult);
    }

    public async Task<ApiResponse<MenuDto>> GetByIdAsync(int id)
    {
        var menu = await _menuRepository.Query()
            .Include(m => m.Category)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (menu == null)
        {
            return ApiResponse<MenuDto>.FailResult("Menu tidak ditemukan");
        }

        var dto = new MenuDto
        {
            Id = menu.Id,
            CategoryId = menu.CategoryId,
            CategoryName = menu.Category?.Name ?? string.Empty,
            Name = menu.Name,
            Description = menu.Description,
            Price = menu.Price,
            ImageUrl = menu.ImageUrl,
            IsAvailable = menu.IsAvailable,
            CreatedAt = menu.CreatedAt
        };

        return ApiResponse<MenuDto>.SuccessResult(dto);
    }

    public async Task<ApiResponse<MenuDto>> CreateAsync(CreateMenuDto dto)
    {
        var category = await _categoryRepository.GetByIdAsync(dto.CategoryId);
        if (category == null)
        {
            return ApiResponse<MenuDto>.FailResult("Kategori tidak valid");
        }

        var menu = new Menu
        {
            CategoryId = dto.CategoryId,
            Name = dto.Name.Trim(),
            Description = dto.Description?.Trim(),
            Price = dto.Price,
            ImageUrl = dto.ImageUrl?.Trim(),
            IsAvailable = dto.IsAvailable,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _menuRepository.AddAsync(menu);

        var resultDto = new MenuDto
        {
            Id = created.Id,
            CategoryId = created.CategoryId,
            CategoryName = category.Name,
            Name = created.Name,
            Description = created.Description,
            Price = created.Price,
            ImageUrl = created.ImageUrl,
            IsAvailable = created.IsAvailable,
            CreatedAt = created.CreatedAt
        };

        return ApiResponse<MenuDto>.SuccessResult(resultDto, "Menu berhasil ditambahkan");
    }

    public async Task<ApiResponse<MenuDto>> UpdateAsync(int id, UpdateMenuDto dto)
    {
        var menu = await _menuRepository.Query()
            .Include(m => m.Category)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (menu == null)
        {
            return ApiResponse<MenuDto>.FailResult("Menu tidak ditemukan");
        }

        var category = await _categoryRepository.GetByIdAsync(dto.CategoryId);
        if (category == null)
        {
            return ApiResponse<MenuDto>.FailResult("Kategori tidak valid");
        }

        menu.CategoryId = dto.CategoryId;
        menu.Name = dto.Name.Trim();
        menu.Description = dto.Description?.Trim();
        menu.Price = dto.Price;
        menu.ImageUrl = dto.ImageUrl?.Trim();
        menu.IsAvailable = dto.IsAvailable;
        menu.UpdatedAt = DateTime.UtcNow;

        await _menuRepository.UpdateAsync(menu);

        var resultDto = new MenuDto
        {
            Id = menu.Id,
            CategoryId = menu.CategoryId,
            CategoryName = category.Name,
            Name = menu.Name,
            Description = menu.Description,
            Price = menu.Price,
            ImageUrl = menu.ImageUrl,
            IsAvailable = menu.IsAvailable,
            CreatedAt = menu.CreatedAt
        };

        return ApiResponse<MenuDto>.SuccessResult(resultDto, "Menu berhasil diperbarui");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(int id)
    {
        var menu = await _menuRepository.GetByIdAsync(id);
        if (menu == null)
        {
            return ApiResponse<bool>.FailResult("Menu tidak ditemukan");
        }

        var hasOrderItems = await _orderItemRepository.Query().AnyAsync(oi => oi.MenuId == id);
        if (hasOrderItems)
        {
            return ApiResponse<bool>.FailResult("Menu tidak dapat dihapus karena sudah ada dalam riwayat pesanan. Anda dapat mengubah statusnya menjadi Tidak Tersedia.");
        }

        await _menuRepository.DeleteAsync(menu);
        return ApiResponse<bool>.SuccessResult(true, "Menu berhasil dihapus");
    }

    public async Task<ApiResponse<bool>> ToggleAvailabilityAsync(int id)
    {
        var menu = await _menuRepository.GetByIdAsync(id);
        if (menu == null)
        {
            return ApiResponse<bool>.FailResult("Menu tidak ditemukan");
        }

        menu.IsAvailable = !menu.IsAvailable;
        menu.UpdatedAt = DateTime.UtcNow;
        await _menuRepository.UpdateAsync(menu);

        var statusText = menu.IsAvailable ? "Tersedia" : "Tidak Tersedia";
        return ApiResponse<bool>.SuccessResult(menu.IsAvailable, $"Status ketersediaan menu diubah menjadi {statusText}");
    }
}
