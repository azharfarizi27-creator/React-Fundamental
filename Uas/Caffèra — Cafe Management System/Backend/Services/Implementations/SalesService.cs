using Caffera.Backend.DTOs.Common;
using Caffera.Backend.DTOs.Order;
using Caffera.Backend.DTOs.Sales;
using Caffera.Backend.Models;
using Caffera.Backend.Repositories.Interfaces;
using Caffera.Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Caffera.Backend.Services.Implementations;

public class SalesService : ISalesService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IRepository<OrderItem> _orderItemRepository;
    private readonly ILogger<SalesService> _logger;

    public SalesService(
        IOrderRepository orderRepository, 
        IRepository<OrderItem> orderItemRepository,
        ILogger<SalesService> logger)
    {
        _orderRepository = orderRepository;
        _orderItemRepository = orderItemRepository;
        _logger = logger;
    }

    public async Task<ApiResponse<PagedResult<OrderDto>>> GetSalesHistoryAsync(OrderFilterParams filterParams)
    {
        _logger.LogInformation("[SALES] 📋 Mengambil riwayat penjualan (Page: {Page}, Size: {Size}, Date: {Start} s/d {End})",
            filterParams.PageNumber, filterParams.PageSize, 
            filterParams.StartDate?.ToString("yyyy-MM-dd") ?? "Awal", 
            filterParams.EndDate?.ToString("yyyy-MM-dd") ?? "Sekarang");

        var query = _orderRepository.Query()
            .Include(o => o.User)
            .Include(o => o.Table)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Menu)
            .AsQueryable();

        // 1. Search filter
        if (!string.IsNullOrWhiteSpace(filterParams.Search))
        {
            var search = filterParams.Search.Trim().ToLower();
            query = query.Where(o => o.OrderNumber.ToLower().Contains(search) ||
                                     o.User!.Name.ToLower().Contains(search));
        }

        // 2. Status filter
        if (!string.IsNullOrWhiteSpace(filterParams.Status))
        {
            query = query.Where(o => o.Status.ToLower() == filterParams.Status.Trim().ToLower());
        }

        // 3. OrderType filter
        if (!string.IsNullOrWhiteSpace(filterParams.OrderType))
        {
            query = query.Where(o => o.OrderType.ToLower() == filterParams.OrderType.Trim().ToLower());
        }

        // 4. Date range filter
        if (filterParams.StartDate.HasValue)
        {
            query = query.Where(o => o.CreatedAt >= filterParams.StartDate.Value.Date);
        }

        if (filterParams.EndDate.HasValue)
        {
            var endOfDay = filterParams.EndDate.Value.Date.AddDays(1).AddTicks(-1);
            query = query.Where(o => o.CreatedAt <= endOfDay);
        }

        var totalCount = await query.CountAsync();

        // 5. Sorting
        query = filterParams.SortBy?.ToLower() switch
        {
            "totalamount" => filterParams.IsAscending ? query.OrderBy(o => o.TotalAmount) : query.OrderByDescending(o => o.TotalAmount),
            "ordernumber" => filterParams.IsAscending ? query.OrderBy(o => o.OrderNumber) : query.OrderByDescending(o => o.OrderNumber),
            "status" => filterParams.IsAscending ? query.OrderBy(o => o.Status) : query.OrderByDescending(o => o.Status),
            _ => query.OrderByDescending(o => o.CreatedAt)
        };

        // 6. Pagination
        var skip = (filterParams.PageNumber - 1) * filterParams.PageSize;
        var orders = await query.Skip(skip).Take(filterParams.PageSize).ToListAsync();

        var dtos = orders.Select(o => new OrderDto
        {
            Id = o.Id,
            OrderNumber = o.OrderNumber,
            UserId = o.UserId,
            UserName = o.User?.Name ?? string.Empty,
            TableId = o.TableId,
            TableNumber = o.Table?.Number,
            OrderType = o.OrderType,
            Status = o.Status,
            TotalAmount = o.TotalAmount,
            CreatedAt = o.CreatedAt,
            Items = o.OrderItems.Select(oi => new OrderItemDto
            {
                Id = oi.Id,
                MenuId = oi.MenuId,
                MenuName = oi.Menu?.Name ?? string.Empty,
                ImageUrl = oi.Menu?.ImageUrl,
                Quantity = oi.Quantity,
                Price = oi.Price,
                Subtotal = oi.Subtotal
            }).ToList()
        });

        var pagedResult = new PagedResult<OrderDto>
        {
            Items = dtos,
            PageNumber = filterParams.PageNumber,
            PageSize = filterParams.PageSize,
            TotalCount = totalCount
        };

        return ApiResponse<PagedResult<OrderDto>>.SuccessResult(pagedResult);
    }

    public async Task<ApiResponse<SalesSummaryDto>> GetSalesSummaryAsync(DateTime? startDate, DateTime? endDate)
    {
        _logger.LogInformation("[SALES] 📊 Menghitung ringkasan penjualan (Periode: {Start} s/d {End})",
            startDate?.ToString("yyyy-MM-dd") ?? "Awal", endDate?.ToString("yyyy-MM-dd") ?? "Sekarang");

        var query = _orderRepository.Query()
            .Where(o => o.Status == "Completed")
            .AsQueryable();

        if (startDate.HasValue)
        {
            query = query.Where(o => o.CreatedAt >= startDate.Value.Date);
        }

        if (endDate.HasValue)
        {
            var endOfDay = endDate.Value.Date.AddDays(1).AddTicks(-1);
            query = query.Where(o => o.CreatedAt <= endOfDay);
        }

        var completedOrders = await query.ToListAsync();
        var totalOrders = completedOrders.Count;
        var totalRevenue = completedOrders.Sum(o => o.TotalAmount);
        var averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        var orderIds = completedOrders.Select(o => o.Id).ToList();
        var totalItemsSold = await _orderItemRepository.Query()
            .Where(oi => orderIds.Contains(oi.OrderId))
            .SumAsync(oi => oi.Quantity);

        _logger.LogInformation("[SALES] 💰 Ringkasan: Total Omset: Rp {Revenue:N0}, Total Transaksi: {Orders}, Total Item Terjual: {Items}",
            totalRevenue, totalOrders, totalItemsSold);

        var summary = new SalesSummaryDto
        {
            TotalRevenue = totalRevenue,
            TotalOrders = totalOrders,
            TotalItemsSold = totalItemsSold,
            AverageOrderValue = averageOrderValue
        };

        return ApiResponse<SalesSummaryDto>.SuccessResult(summary);
    }
}
