using Caffera.Backend.Models;

namespace Caffera.Backend.Repositories.Interfaces;

public interface IOrderRepository : IRepository<Order>
{
    Task<Order?> GetOrderWithDetailsAsync(int id);
    Task<Order?> GetOrderByNumberWithDetailsAsync(string orderNumber);
    Task<string> GenerateOrderNumberAsync();
}
