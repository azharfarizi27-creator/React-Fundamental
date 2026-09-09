using Caffera.Backend.DTOs.Common;
using Caffera.Backend.DTOs.Table;
using Caffera.Backend.Models;
using Caffera.Backend.Repositories.Interfaces;
using Caffera.Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Caffera.Backend.Services.Implementations;

public class TableService : ITableService
{
    private readonly IRepository<Table> _tableRepository;
    private readonly IRepository<Order> _orderRepository;
    private readonly ILogger<TableService> _logger;

    public TableService(
        IRepository<Table> tableRepository, 
        IRepository<Order> orderRepository,
        ILogger<TableService> logger)
    {
        _tableRepository = tableRepository;
        _orderRepository = orderRepository;
        _logger = logger;
    }

    public async Task<ApiResponse<IEnumerable<TableDto>>> GetAllAsync(string? status = null)
    {
        _logger.LogInformation("[TABLE] 📋 Mengambil daftar meja (Status: '{Status}')", status ?? "All");

        var query = _tableRepository.Query().AsQueryable();

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(t => t.Status.ToLower() == status.Trim().ToLower());
        }

        var tables = await query.OrderBy(t => t.Number).ToListAsync();

        var dtos = tables.Select(t => new TableDto
        {
            Id = t.Id,
            Number = t.Number,
            Capacity = t.Capacity,
            Status = t.Status,
            CreatedAt = t.CreatedAt
        });

        return ApiResponse<IEnumerable<TableDto>>.SuccessResult(dtos);
    }

    public async Task<ApiResponse<TableDto>> GetByIdAsync(int id)
    {
        _logger.LogInformation("[TABLE] 🔍 Mengambil detail meja ID: {TableId}", id);

        var table = await _tableRepository.GetByIdAsync(id);
        if (table == null)
        {
            _logger.LogWarning("[TABLE] ⚠️ Meja dengan ID {TableId} tidak ditemukan", id);
            return ApiResponse<TableDto>.FailResult("Meja tidak ditemukan");
        }

        var dto = new TableDto
        {
            Id = table.Id,
            Number = table.Number,
            Capacity = table.Capacity,
            Status = table.Status,
            CreatedAt = table.CreatedAt
        };

        return ApiResponse<TableDto>.SuccessResult(dto);
    }

    public async Task<ApiResponse<TableDto>> CreateAsync(CreateTableDto dto)
    {
        _logger.LogInformation("[TABLE] ➕ Menambahkan meja baru No: {Number}, Kapasitas: {Capacity}, Status: '{Status}'", 
            dto.Number, dto.Capacity, dto.Status ?? "Available");

        var exists = await _tableRepository.Query().AnyAsync(t => t.Number == dto.Number);
        if (exists)
        {
            _logger.LogWarning("[TABLE] ⚠️ Gagal tambah meja: Nomor meja {Number} sudah terdaftar", dto.Number);
            return ApiResponse<TableDto>.FailResult($"Meja nomor {dto.Number} sudah terdaftar");
        }

        var table = new Table
        {
            Number = dto.Number,
            Capacity = dto.Capacity,
            Status = string.IsNullOrWhiteSpace(dto.Status) ? "Available" : dto.Status,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _tableRepository.AddAsync(table);
        _logger.LogInformation("[TABLE] ✅ Meja #{Number} (ID: {TableId}) berhasil ditambahkan", created.Number, created.Id);

        var resultDto = new TableDto
        {
            Id = created.Id,
            Number = created.Number,
            Capacity = created.Capacity,
            Status = created.Status,
            CreatedAt = created.CreatedAt
        };

        return ApiResponse<TableDto>.SuccessResult(resultDto, "Meja berhasil ditambahkan");
    }

    public async Task<ApiResponse<TableDto>> UpdateAsync(int id, UpdateTableDto dto)
    {
        _logger.LogInformation("[TABLE] ✏️ Memperbarui data meja ID: {TableId} (No: {Number})", id, dto.Number);

        var table = await _tableRepository.GetByIdAsync(id);
        if (table == null)
        {
            _logger.LogWarning("[TABLE] ⚠️ Gagal update: Meja ID {TableId} tidak ditemukan", id);
            return ApiResponse<TableDto>.FailResult("Meja tidak ditemukan");
        }

        var numberExists = await _tableRepository.Query()
            .AnyAsync(t => t.Id != id && t.Number == dto.Number);

        if (numberExists)
        {
            _logger.LogWarning("[TABLE] ⚠️ Gagal update meja ID {TableId}: Nomor meja {Number} sudah digunakan meja lain", id, dto.Number);
            return ApiResponse<TableDto>.FailResult($"Meja nomor {dto.Number} sudah digunakan");
        }

        table.Number = dto.Number;
        table.Capacity = dto.Capacity;
        table.Status = dto.Status;
        table.UpdatedAt = DateTime.UtcNow;

        await _tableRepository.UpdateAsync(table);
        _logger.LogInformation("[TABLE] ✅ Data meja ID {TableId} (No: {Number}) berhasil diperbarui", id, table.Number);

        var resultDto = new TableDto
        {
            Id = table.Id,
            Number = table.Number,
            Capacity = table.Capacity,
            Status = table.Status,
            CreatedAt = table.CreatedAt
        };

        return ApiResponse<TableDto>.SuccessResult(resultDto, "Data meja berhasil diperbarui");
    }

    public async Task<ApiResponse<TableDto>> UpdateStatusAsync(int id, UpdateTableStatusDto dto)
    {
        _logger.LogInformation("[TABLE] 🔄 Memperbarui status meja ID: {TableId} ke '{NewStatus}'", id, dto.Status);

        var table = await _tableRepository.GetByIdAsync(id);
        if (table == null)
        {
            _logger.LogWarning("[TABLE] ⚠️ Gagal update status: Meja ID {TableId} tidak ditemukan", id);
            return ApiResponse<TableDto>.FailResult("Meja tidak ditemukan");
        }

        var validStatuses = new[] { "Available", "Occupied", "Reserved" };
        if (!validStatuses.Contains(dto.Status, StringComparer.OrdinalIgnoreCase))
        {
            _logger.LogWarning("[TABLE] ⚠️ Status meja '{InvalidStatus}' tidak valid (Harus: Available/Occupied/Reserved)", dto.Status);
            return ApiResponse<TableDto>.FailResult("Status meja harus Available, Occupied, atau Reserved");
        }

        var oldStatus = table.Status;
        table.Status = dto.Status;
        table.UpdatedAt = DateTime.UtcNow;

        await _tableRepository.UpdateAsync(table);
        _logger.LogInformation("[TABLE] ✅ Status meja #{Number} (ID: {TableId}) berhasil diubah: '{OldStatus}' -> '{NewStatus}'", 
            table.Number, table.Id, oldStatus, table.Status);

        var resultDto = new TableDto
        {
            Id = table.Id,
            Number = table.Number,
            Capacity = table.Capacity,
            Status = table.Status,
            CreatedAt = table.CreatedAt
        };

        return ApiResponse<TableDto>.SuccessResult(resultDto, "Status meja berhasil diperbarui");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(int id)
    {
        _logger.LogInformation("[TABLE] 🗑️ Memproses penghapusan meja ID: {TableId}", id);

        var table = await _tableRepository.GetByIdAsync(id);
        if (table == null)
        {
            _logger.LogWarning("[TABLE] ⚠️ Gagal hapus: Meja ID {TableId} tidak ditemukan", id);
            return ApiResponse<bool>.FailResult("Meja tidak ditemukan");
        }

        var hasActiveOrders = await _orderRepository.Query()
            .AnyAsync(o => o.TableId == id && (o.Status == "Pending" || o.Status == "Preparing" || o.Status == "Ready"));

        if (hasActiveOrders)
        {
            _logger.LogWarning("[TABLE] ⚠️ Hapus meja #{Number} (ID: {TableId}) ditolak: Meja sedang memiliki pesanan aktif", table.Number, id);
            return ApiResponse<bool>.FailResult("Tidak dapat menghapus meja yang sedang memiliki pesanan aktif");
        }

        await _tableRepository.DeleteAsync(table);
        _logger.LogInformation("[TABLE] ✅ Meja #{Number} (ID: {TableId}) berhasil dihapus", table.Number, id);

        return ApiResponse<bool>.SuccessResult(true, "Meja berhasil dihapus");
    }
}
