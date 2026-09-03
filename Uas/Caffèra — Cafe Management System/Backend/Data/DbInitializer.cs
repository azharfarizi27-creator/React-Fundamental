using Caffera.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Caffera.Backend.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        // Ensure database is created and migrations applied
        await context.Database.MigrateAsync();

        // Ensure Admin user has valid BCrypt hash
        var admin = await context.Users.FirstOrDefaultAsync(u => u.Email == "admin@caffera.com");
        if (admin != null)
        {
            admin.PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123");
            context.Users.Update(admin);
        }

        // Ensure Cashier user has valid BCrypt hash
        var cashier = await context.Users.FirstOrDefaultAsync(u => u.Email == "cashier@caffera.com");
        if (cashier != null)
        {
            cashier.PasswordHash = BCrypt.Net.BCrypt.HashPassword("cashier123");
            context.Users.Update(cashier);
        }

        await context.SaveChangesAsync();
    }
}
