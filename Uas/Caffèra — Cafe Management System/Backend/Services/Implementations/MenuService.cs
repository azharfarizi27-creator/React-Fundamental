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
    private readonly ILogger<MenuService> _logger;

    public MenuService(
        IRepository<Menu> menuRepository, 
        IRepository<Category> categoryRepository,
        IRepository<OrderItem> orderItemRepository,
        ILogger<MenuService> logger)
    {
        _menuRepository = menuRepository;
        _categoryRepository = categoryRepository;
        _orderItemRepository = orderItemRepository;
        _logger = logger;
    }

    public async Task<ApiResponse<PagedResult<MenuDto>>> GetAllAsync(MenuFilterParams filterParams)
    {
        _logger.LogInformation("[MENU] 📋 Mengambil daftar menu (Page: {Page}, Size: {Size}, CategoryId: {CatId}, Available: {Avail}, Search: '{Search}')",
            filterParams.PageNumber, filterParams.PageSize, filterParams.CategoryId?.ToString() ?? "All", filterParams.IsAvailable?.ToString() ?? "All", filterParams.Search ?? "-");

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
        _logger.LogInformation("[MENU] 🔍 Mengambil detail menu ID: {MenuId}", id);
        var menu = await _menuRepository.Query()
            .Include(m => m.Category)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (menu == null)
        {
            _logger.LogWarning("[MENU] ⚠️ Menu dengan ID {MenuId} tidak ditemukan", id);
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
        _logger.LogInformation("[MENU] ➕ Menambahkan menu baru: '{MenuName}', Harga: Rp {Price:N0}, Kategori ID: {CatId}", 
            dto.Name, dto.Price, dto.CategoryId);

        var category = await _categoryRepository.GetByIdAsync(dto.CategoryId);
        if (category == null)
        {
            _logger.LogWarning("[MENU] ⚠️ Gagal tambah menu: Kategori ID {CatId} tidak valid/tidak ditemukan", dto.CategoryId);
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
        _logger.LogInformation("[MENU] ✅ Menu berhasil ditambahkan: '{MenuName}' (ID: {MenuId}) pada kategori '{CategoryName}'", 
            created.Name, created.Id, category.Name);

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
        _logger.LogInformation("[MENU] ✏️ Memperbarui menu ID: {MenuId} ('{MenuName}')", id, dto.Name);

        var menu = await _menuRepository.Query()
            .Include(m => m.Category)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (menu == null)
        {
            _logger.LogWarning("[MENU] ⚠️ Gagal perbarui: Menu ID {MenuId} tidak ditemukan", id);
            return ApiResponse<MenuDto>.FailResult("Menu tidak ditemukan");
        }

        var category = await _categoryRepository.GetByIdAsync(dto.CategoryId);
        if (category == null)
        {
            _logger.LogWarning("[MENU] ⚠️ Gagal perbarui menu: Kategori ID {CatId} tidak valid", dto.CategoryId);
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
        _logger.LogInformation("[MENU] ✅ Menu ID {MenuId} berhasil diperbarui: '{MenuName}'", id, menu.Name);

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
        _logger.LogInformation("[MENU] 🗑️ Memproses penghapusan menu ID: {MenuId}", id);

        var menu = await _menuRepository.GetByIdAsync(id);
        if (menu == null)
        {
            _logger.LogWarning("[MENU] ⚠️ Gagal hapus: Menu ID {MenuId} tidak ditemukan", id);
            return ApiResponse<bool>.FailResult("Menu tidak ditemukan");
        }

        var hasOrderItems = await _orderItemRepository.Query().AnyAsync(oi => oi.MenuId == id);
        if (hasOrderItems)
        {
            _logger.LogWarning("[MENU] ⚠️ Penghapusan menu ID {MenuId} ('{MenuName}') ditolak: Menu sudah tercatat dalam riwayat pesanan", id, menu.Name);
            return ApiResponse<bool>.FailResult("Menu tidak dapat dihapus karena sudah ada dalam riwayat pesanan. Anda dapat mengubah statusnya menjadi Tidak Tersedia.");
        }

        await _menuRepository.DeleteAsync(menu);
        _logger.LogInformation("[MENU] ✅ Menu ID {MenuId} ('{MenuName}') berhasil dihapus dari database", id, menu.Name);

        return ApiResponse<bool>.SuccessResult(true, "Menu berhasil dihapus");
    }

    public async Task<ApiResponse<bool>> ToggleAvailabilityAsync(int id)
    {
        _logger.LogInformation("[MENU] 🔄 Mengubah status ketersediaan menu ID: {MenuId}", id);

        var menu = await _menuRepository.GetByIdAsync(id);
        if (menu == null)
        {
            _logger.LogWarning("[MENU] ⚠️ Gagal toggle status: Menu ID {MenuId} tidak ditemukan", id);
            return ApiResponse<bool>.FailResult("Menu tidak ditemukan");
        }

        menu.IsAvailable = !menu.IsAvailable;
        menu.UpdatedAt = DateTime.UtcNow;
        await _menuRepository.UpdateAsync(menu);

        var statusText = menu.IsAvailable ? "Tersedia" : "Tidak Tersedia";
        _logger.LogInformation("[MENU] ✅ Status menu '{MenuName}' (ID: {MenuId}) diubah menjadi: {Status}", menu.Name, menu.Id, statusText);

        return ApiResponse<bool>.SuccessResult(menu.IsAvailable, $"Status ketersediaan menu diubah menjadi {statusText}");
    }
}
