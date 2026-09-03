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

    public TableService(IRepository<Table> tableRepository, IRepository<Order> orderRepository)
    {
        _tableRepository = tableRepository;
        _orderRepository = orderRepository;
    }

    public async Task<ApiResponse<IEnumerable<TableDto>>> GetAllAsync(string? status = null)
    {
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
        var table = await _tableRepository.GetByIdAsync(id);
        if (table == null)
        {
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
        var exists = await _tableRepository.Query().AnyAsync(t => t.Number == dto.Number);
        if (exists)
        {
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
        var table = await _tableRepository.GetByIdAsync(id);
        if (table == null)
        {
            return ApiResponse<TableDto>.FailResult("Meja tidak ditemukan");
        }

        var numberExists = await _tableRepository.Query()
            .AnyAsync(t => t.Id != id && t.Number == dto.Number);

        if (numberExists)
        {
            return ApiResponse<TableDto>.FailResult($"Meja nomor {dto.Number} sudah digunakan");
        }

        table.Number = dto.Number;
        table.Capacity = dto.Capacity;
        table.Status = dto.Status;
        table.UpdatedAt = DateTime.UtcNow;

        await _tableRepository.UpdateAsync(table);

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
        var table = await _tableRepository.GetByIdAsync(id);
        if (table == null)
        {
            return ApiResponse<TableDto>.FailResult("Meja tidak ditemukan");
        }

        var validStatuses = new[] { "Available", "Occupied", "Reserved" };
        if (!validStatuses.Contains(dto.Status, StringComparer.OrdinalIgnoreCase))
        {
            return ApiResponse<TableDto>.FailResult("Status meja harus Available, Occupied, atau Reserved");
        }

        table.Status = dto.Status;
        table.UpdatedAt = DateTime.UtcNow;

        await _tableRepository.UpdateAsync(table);

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
        var table = await _tableRepository.GetByIdAsync(id);
        if (table == null)
        {
            return ApiResponse<bool>.FailResult("Meja tidak ditemukan");
        }

        var hasActiveOrders = await _orderRepository.Query()
            .AnyAsync(o => o.TableId == id && (o.Status == "Pending" || o.Status == "Preparing" || o.Status == "Ready"));

        if (hasActiveOrders)
        {
            return ApiResponse<bool>.FailResult("Tidak dapat menghapus meja yang sedang memiliki pesanan aktif");
        }

        await _tableRepository.DeleteAsync(table);
        return ApiResponse<bool>.SuccessResult(true, "Meja berhasil dihapus");
    }
}
