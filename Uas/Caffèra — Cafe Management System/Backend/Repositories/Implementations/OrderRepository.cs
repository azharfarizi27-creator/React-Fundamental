using Caffera.Backend.Data;
using Caffera.Backend.Models;
using Caffera.Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Caffera.Backend.Repositories.Implementations;

public class OrderRepository : Repository<Order>, IOrderRepository
{
    public OrderRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<Order?> GetOrderWithDetailsAsync(int id)
    {
        return await _dbSet
            .Include(o => o.User)
            .Include(o => o.Table)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Menu)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<Order?> GetOrderByNumberWithDetailsAsync(string orderNumber)
    {
        return await _dbSet
            .Include(o => o.User)
            .Include(o => o.Table)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Menu)
            .FirstOrDefaultAsync(o => o.OrderNumber == orderNumber);
    }

    public async Task<string> GenerateOrderNumberAsync()
    {
        var today = DateTime.UtcNow.ToString("yyyyMMdd");
        var countToday = await _dbSet
            .Where(o => o.CreatedAt.Date == DateTime.UtcNow.Date)
            .CountAsync();

        return $"ORD-{today}-{(countToday + 1):D3}";
    }
}
