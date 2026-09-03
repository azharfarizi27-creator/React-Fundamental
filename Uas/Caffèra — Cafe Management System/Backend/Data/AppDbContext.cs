using Caffera.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Caffera.Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Menu> Menus => Set<Menu>();
    public DbSet<Table> Tables => Set<Table>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ==========================================
        // 1. UNIQUE CONSTRAINTS & INDEXES
        // ==========================================
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Category>()
            .HasIndex(c => c.Name)
            .IsUnique();

        modelBuilder.Entity<Table>()
            .HasIndex(t => t.Number)
            .IsUnique();

        modelBuilder.Entity<Order>()
            .HasIndex(o => o.OrderNumber)
            .IsUnique();

        // ==========================================
        // 2. RELATIONSHIPS & DELETE BEHAVIORS
        // ==========================================
        
        // Category 1 -> N Menus (Restrict delete jika kategori masih punya menu)
        modelBuilder.Entity<Category>()
            .HasMany(c => c.Menus)
            .WithOne(m => m.Category)
            .HasForeignKey(m => m.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        // User 1 -> N Orders (Restrict delete jika user punya riwayat order)
        modelBuilder.Entity<User>()
            .HasMany(u => u.Orders)
            .WithOne(o => o.User)
            .HasForeignKey(o => o.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Table 1 -> N Orders (Set null jika meja dihapus / opsional)
        modelBuilder.Entity<Table>()
            .HasMany(t => t.Orders)
            .WithOne(o => o.Table)
            .HasForeignKey(o => o.TableId)
            .OnDelete(DeleteBehavior.SetNull);

        // Order 1 -> N OrderItems (Cascade delete jika order dibatalkan/dihapus)
        modelBuilder.Entity<Order>()
            .HasMany(o => o.OrderItems)
            .WithOne(oi => oi.Order)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        // Menu 1 -> N OrderItems (Restrict delete jika menu pernah dipesan)
        modelBuilder.Entity<Menu>()
            .HasMany(m => m.OrderItems)
            .WithOne(oi => oi.Menu)
            .HasForeignKey(oi => oi.MenuId)
            .OnDelete(DeleteBehavior.Restrict);

        // ==========================================
        // 3. SEED INITIAL DATA
        // ==========================================
        SeedInitialData(modelBuilder);
    }

    private static void SeedInitialData(ModelBuilder modelBuilder)
    {
        var fixedDate = new DateTime(2026, 9, 1, 0, 0, 0, DateTimeKind.Utc);

        // A. Users Seed (Password: "admin123" dan "cashier123" dengan hash BCrypt statis)
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                Name = "Admin Caffèra",
                Email = "admin@caffera.com",
                PasswordHash = "$2a$11$f5.yH7p7o1V2iK6vP3kIbe.jX1p/0r9tK8gR6vP2lM1eO2iH7p7o1", // admin123
                Role = "Admin",
                CreatedAt = fixedDate
            },
            new User
            {
                Id = 2,
                Name = "Kasir Caffèra",
                Email = "cashier@caffera.com",
                PasswordHash = "$2a$11$f5.yH7p7o1V2iK6vP3kIbe.jX1p/0r9tK8gR6vP2lM1eO2iH7p7o1", // cashier123
                Role = "Cashier",
                CreatedAt = fixedDate
            }
        );

        // B. Categories Seed
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Coffee", Description = "Espresso and artisan brewed coffees", CreatedAt = fixedDate },
            new Category { Id = 2, Name = "Non Coffee", Description = "Tea, chocolate, and milk based beverages", CreatedAt = fixedDate },
            new Category { Id = 3, Name = "Food", Description = "Hearty main dishes and breakfast meals", CreatedAt = fixedDate },
            new Category { Id = 4, Name = "Snack", Description = "Light bites and savories to share", CreatedAt = fixedDate },
            new Category { Id = 5, Name = "Dessert", Description = "Sweet treats, cakes, and pastries", CreatedAt = fixedDate }
        );

        // C. Tables Seed (10 Tables)
        modelBuilder.Entity<Table>().HasData(
            new Table { Id = 1, Number = 1, Capacity = 2, Status = "Available", CreatedAt = fixedDate },
            new Table { Id = 2, Number = 2, Capacity = 2, Status = "Occupied", CreatedAt = fixedDate },
            new Table { Id = 3, Number = 3, Capacity = 4, Status = "Available", CreatedAt = fixedDate },
            new Table { Id = 4, Number = 4, Capacity = 4, Status = "Reserved", CreatedAt = fixedDate },
            new Table { Id = 5, Number = 5, Capacity = 4, Status = "Available", CreatedAt = fixedDate },
            new Table { Id = 6, Number = 6, Capacity = 6, Status = "Available", CreatedAt = fixedDate },
            new Table { Id = 7, Number = 7, Capacity = 6, Status = "Occupied", CreatedAt = fixedDate },
            new Table { Id = 8, Number = 8, Capacity = 2, Status = "Available", CreatedAt = fixedDate },
            new Table { Id = 9, Number = 9, Capacity = 8, Status = "Available", CreatedAt = fixedDate },
            new Table { Id = 10, Number = 10, Capacity = 10, Status = "Available", CreatedAt = fixedDate }
        );

        // D. Menus Seed (22 items variatif)
        modelBuilder.Entity<Menu>().HasData(
            // Coffee (CategoryId: 1)
            new Menu { Id = 1, CategoryId = 1, Name = "Espresso Single", Description = "Rich and concentrated shot of pure arabica coffee", Price = 18000, ImageUrl = "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500", IsAvailable = true, CreatedAt = fixedDate },
            new Menu { Id = 2, CategoryId = 1, Name = "Americano Hot / Iced", Description = "Espresso shots diluted with hot water or poured over ice", Price = 22000, ImageUrl = "https://images.unsplash.com/photo-1551030173-122aabc4489c?w=500", IsAvailable = true, CreatedAt = fixedDate },
            new Menu { Id = 3, CategoryId = 1, Name = "Caffè Latte", Description = "Silky steamed milk poured over a double shot of espresso", Price = 28000, ImageUrl = "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=500", IsAvailable = true, CreatedAt = fixedDate },
            new Menu { Id = 4, CategoryId = 1, Name = "Cappuccino", Description = "Balanced espresso with equal parts steamed milk and dense foam", Price = 28000, ImageUrl = "https://images.unsplash.com/photo-1534778101976-62847782c213?w=500", IsAvailable = true, CreatedAt = fixedDate },
            new Menu { Id = 5, CategoryId = 1, Name = "Caramel Macchiato", Description = "Fresh vanilla milk marked with espresso and artisan caramel drizzle", Price = 34000, ImageUrl = "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=500", IsAvailable = true, CreatedAt = fixedDate },
            new Menu { Id = 6, CategoryId = 1, Name = "Palm Sugar Latte (Kopi Aren)", Description = "Signature iced latte sweetened with authentic Indonesian aren sugar", Price = 26000, ImageUrl = "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500", IsAvailable = true, CreatedAt = fixedDate },

            // Non Coffee (CategoryId: 2)
            new Menu { Id = 7, CategoryId = 2, Name = "Matcha Green Tea Latte", Description = "Premium Uji matcha whisked with velvety steamed fresh milk", Price = 30000, ImageUrl = "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500", IsAvailable = true, CreatedAt = fixedDate },
            new Menu { Id = 8, CategoryId = 2, Name = "Signature Dark Chocolate", Description = "Decadent melted Belgian chocolate with creamy whole milk", Price = 30000, ImageUrl = "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=500", IsAvailable = true, CreatedAt = fixedDate },
            new Menu { Id = 9, CategoryId = 2, Name = "Earl Grey Milk Tea", Description = "Aromatic black tea infused with bergamot and sweet cream", Price = 25000, ImageUrl = "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500", IsAvailable = true, CreatedAt = fixedDate },
            new Menu { Id = 10, CategoryId = 2, Name = "Lychee Iced Tea", Description = "Refreshing iced brewed tea infused with sweet whole lychee fruit", Price = 24000, ImageUrl = "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500", IsAvailable = true, CreatedAt = fixedDate },

            // Food (CategoryId: 3)
            new Menu { Id = 11, CategoryId = 3, Name = "Caffèra Fried Rice (Nasi Goreng)", Description = "Indonesian style fried rice with smoked chicken, egg, and crackers", Price = 38000, ImageUrl = "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500", IsAvailable = true, CreatedAt = fixedDate },
            new Menu { Id = 12, CategoryId = 3, Name = "Creamy Carbonara Pasta", Description = "Spaghetti tossed in rich egg parmesan sauce with crispy smoked beef", Price = 42000, ImageUrl = "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500", IsAvailable = true, CreatedAt = fixedDate },
            new Menu { Id = 13, CategoryId = 3, Name = "Chicken Katsu Curry Rice", Description = "Crispy golden chicken cutlet served with aromatic Japanese curry sauce", Price = 45000, ImageUrl = "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=500", IsAvailable = true, CreatedAt = fixedDate },
            new Menu { Id = 14, CategoryId = 3, Name = "Classic Beef Burger", Description = "Juicy beef patty, melted cheddar, caramelized onion in brioche bun", Price = 48000, ImageUrl = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500", IsAvailable = true, CreatedAt = fixedDate },

            // Snack (CategoryId: 4)
            new Menu { Id = 15, CategoryId = 4, Name = "French Fries with Truffle Mayo", Description = "Crispy shoestring fries seasoned with sea salt and truffle dip", Price = 25000, ImageUrl = "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500", IsAvailable = true, CreatedAt = fixedDate },
            new Menu { Id = 16, CategoryId = 4, Name = "Crispy Chicken Wings (6 pcs)", Description = "Tender wings glazed with sweet and spicy barbecue sauce", Price = 32000, ImageUrl = "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500", IsAvailable = true, CreatedAt = fixedDate },
            new Menu { Id = 17, CategoryId = 4, Name = "Fried Platter Combo", Description = "Combo basket of french fries, chicken nuggets, and sausage bites", Price = 35000, ImageUrl = "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=500", IsAvailable = true, CreatedAt = fixedDate },
            new Menu { Id = 18, CategoryId = 4, Name = "Nachos with Guacamole & Cheese", Description = "Corn tortilla chips layered with molten cheese sauce and salsa", Price = 28000, ImageUrl = "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=500", IsAvailable = true, CreatedAt = fixedDate },

            // Dessert (CategoryId: 5)
            new Menu { Id = 19, CategoryId = 5, Name = "Butter Croissant", Description = "Flaky, buttery French viennoiserie baked fresh every morning", Price = 22000, ImageUrl = "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500", IsAvailable = true, CreatedAt = fixedDate },
            new Menu { Id = 20, CategoryId = 5, Name = "Burnt Basque Cheesecake", Description = "Creamy caramelized cheesecake with rich Spanish vanilla notes", Price = 32000, ImageUrl = "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500", IsAvailable = true, CreatedAt = fixedDate },
            new Menu { Id = 21, CategoryId = 5, Name = "Classic Tiramisu", Description = "Espresso soaked ladyfingers layered with whipped mascarpone cream", Price = 35000, ImageUrl = "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500", IsAvailable = true, CreatedAt = fixedDate },
            new Menu { Id = 22, CategoryId = 5, Name = "Fudgy Chocolate Brownie", Description = "Warm dark chocolate brownie served with vanilla ice cream scoop", Price = 26000, ImageUrl = "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500", IsAvailable = true, CreatedAt = fixedDate }
        );
    }
}
