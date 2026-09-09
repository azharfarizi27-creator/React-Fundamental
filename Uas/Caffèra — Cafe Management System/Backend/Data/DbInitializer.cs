using Caffera.Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;

namespace Caffera.Backend.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        Console.ForegroundColor = ConsoleColor.Cyan;
        Console.WriteLine("\n[DATABASE] 🔄 Memulai pengecekan & inisialisasi database...");
        Console.ResetColor();

        try
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            // Ensure database is created and migrations applied
            if (context.Database.IsNpgsql())
            {
                Console.WriteLine("[DATABASE] 📦 Memeriksa & menginisialisasi skema tabel PostgreSQL...");
                var databaseCreator = context.Database.GetService<IDatabaseCreator>() as RelationalDatabaseCreator;
                if (databaseCreator != null)
                {
                    try
                    {
                        // Check if Users table already exists
                        _ = await context.Users.AnyAsync();
                        Console.WriteLine("[DATABASE] ℹ️ Tabel database PostgreSQL sudah ada.");
                    }
                    catch
                    {
                        // Users table doesn't exist, create all tables and initial seed
                        Console.WriteLine("[DATABASE] 🛠️ Membuat tabel-tabel dan data awal di PostgreSQL...");
                        await databaseCreator.CreateTablesAsync();
                        Console.WriteLine("[DATABASE] ✨ Tabel berhasil dibuat di PostgreSQL.");
                    }
                }
                else
                {
                    await context.Database.EnsureCreatedAsync();
                }

                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine("[DATABASE] ✅ Database PostgreSQL terhubung & skema tabel siap.");
                Console.ResetColor();
            }
            else
            {
                Console.WriteLine("[DATABASE] 📦 Menerapkan EF Core Migrations SQL Server...");
                try
                {
                    await context.Database.MigrateAsync();
                }
                catch
                {
                    await context.Database.EnsureCreatedAsync();
                }
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine("[DATABASE] ✅ Database SQL Server terhubung & migrasi siap.");
                Console.ResetColor();
            }

            // Ensure Admin user has valid BCrypt hash
            var admin = await context.Users.FirstOrDefaultAsync(u => u.Email == "admin@caffera.com");
            if (admin != null)
            {
                admin.PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123");
                context.Users.Update(admin);
                Console.WriteLine("[DATABASE] 👤 Akun default Admin (admin@caffera.com) terverifikasi.");
            }

            // Ensure Cashier user has valid BCrypt hash
            var cashier = await context.Users.FirstOrDefaultAsync(u => u.Email == "cashier@caffera.com");
            if (cashier != null)
            {
                cashier.PasswordHash = BCrypt.Net.BCrypt.HashPassword("cashier123");
                context.Users.Update(cashier);
                Console.WriteLine("[DATABASE] 👤 Akun default Cashier (cashier@caffera.com) terverifikasi.");
            }

            await context.SaveChangesAsync();

            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("[DATABASE] 🚀 Inisialisasi Database selesai dengan sukses!\n");
            Console.ResetColor();
        }
        catch (Exception ex)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine("\n" + new string('!', 75));
            Console.WriteLine("[DATABASE ERROR] ❌ GAGAL MENGHUBUNGKAN ATAU MENGINISIALISASI DATABASE!");
            Console.WriteLine(new string('!', 75));
            Console.ResetColor();

            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine($"Pesan Error   : {ex.Message}");
            if (ex.InnerException != null)
            {
                Console.WriteLine($"Detail Internal: {ex.InnerException.Message}");
            }
            Console.WriteLine("\n💡 TIPS PENANGANAN:");
            Console.WriteLine("1. Pastikan SQL Server Service atau koneksi PostgreSQL (Supabase/Neon) aktif.");
            Console.WriteLine("2. Periksa ConnectionString di file 'appsettings.json' atau 'appsettings.Production.json'.");
            Console.WriteLine("3. Pastikan kredensial/password dan port database sudah benar.");
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine(new string('!', 75) + "\n");
            Console.ResetColor();

            // Re-throw so startup stops or continues based on server config
            throw;
        }
    }
}
