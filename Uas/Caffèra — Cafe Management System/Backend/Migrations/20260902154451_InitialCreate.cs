using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Caffera.Backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Tables",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Number = table.Column<int>(type: "int", nullable: false),
                    Capacity = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tables", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Role = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Menus",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsAvailable = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Menus", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Menus_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderNumber = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    TableId = table.Column<int>(type: "int", nullable: true),
                    OrderType = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Orders_Tables_TableId",
                        column: x => x.TableId,
                        principalTable: "Tables",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Orders_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "OrderItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderId = table.Column<int>(type: "int", nullable: false),
                    MenuId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Subtotal = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderItems_Menus_MenuId",
                        column: x => x.MenuId,
                        principalTable: "Menus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OrderItems_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "CreatedAt", "Description", "Name", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Espresso and artisan brewed coffees", "Coffee", null },
                    { 2, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Tea, chocolate, and milk based beverages", "Non Coffee", null },
                    { 3, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Hearty main dishes and breakfast meals", "Food", null },
                    { 4, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Light bites and savories to share", "Snack", null },
                    { 5, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Sweet treats, cakes, and pastries", "Dessert", null }
                });

            migrationBuilder.InsertData(
                table: "Tables",
                columns: new[] { "Id", "Capacity", "CreatedAt", "Number", "Status", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, 2, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, "Available", null },
                    { 2, 2, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), 2, "Occupied", null },
                    { 3, 4, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), 3, "Available", null },
                    { 4, 4, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), 4, "Reserved", null },
                    { 5, 4, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), 5, "Available", null },
                    { 6, 6, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), 6, "Available", null },
                    { 7, 6, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), 7, "Occupied", null },
                    { 8, 2, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), 8, "Available", null },
                    { 9, 8, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), 9, "Available", null },
                    { 10, 10, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), 10, "Available", null }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "Name", "PasswordHash", "Role", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "admin@caffera.com", "Admin Caffèra", "$2a$11$f5.yH7p7o1V2iK6vP3kIbe.jX1p/0r9tK8gR6vP2lM1eO2iH7p7o1", "Admin", null },
                    { 2, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "cashier@caffera.com", "Kasir Caffèra", "$2a$11$f5.yH7p7o1V2iK6vP3kIbe.jX1p/0r9tK8gR6vP2lM1eO2iH7p7o1", "Cashier", null }
                });

            migrationBuilder.InsertData(
                table: "Menus",
                columns: new[] { "Id", "CategoryId", "CreatedAt", "Description", "ImageUrl", "IsAvailable", "Name", "Price", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, 1, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Rich and concentrated shot of pure arabica coffee", "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500", true, "Espresso Single", 18000m, null },
                    { 2, 1, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Espresso shots diluted with hot water or poured over ice", "https://images.unsplash.com/photo-1551030173-122aabc4489c?w=500", true, "Americano Hot / Iced", 22000m, null },
                    { 3, 1, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Silky steamed milk poured over a double shot of espresso", "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=500", true, "Caffè Latte", 28000m, null },
                    { 4, 1, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Balanced espresso with equal parts steamed milk and dense foam", "https://images.unsplash.com/photo-1534778101976-62847782c213?w=500", true, "Cappuccino", 28000m, null },
                    { 5, 1, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Fresh vanilla milk marked with espresso and artisan caramel drizzle", "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=500", true, "Caramel Macchiato", 34000m, null },
                    { 6, 1, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Signature iced latte sweetened with authentic Indonesian aren sugar", "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500", true, "Palm Sugar Latte (Kopi Aren)", 26000m, null },
                    { 7, 2, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Premium Uji matcha whisked with velvety steamed fresh milk", "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500", true, "Matcha Green Tea Latte", 30000m, null },
                    { 8, 2, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Decadent melted Belgian chocolate with creamy whole milk", "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=500", true, "Signature Dark Chocolate", 30000m, null },
                    { 9, 2, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Aromatic black tea infused with bergamot and sweet cream", "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500", true, "Earl Grey Milk Tea", 25000m, null },
                    { 10, 2, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Refreshing iced brewed tea infused with sweet whole lychee fruit", "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500", true, "Lychee Iced Tea", 24000m, null },
                    { 11, 3, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Indonesian style fried rice with smoked chicken, egg, and crackers", "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500", true, "Caffèra Fried Rice (Nasi Goreng)", 38000m, null },
                    { 12, 3, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Spaghetti tossed in rich egg parmesan sauce with crispy smoked beef", "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500", true, "Creamy Carbonara Pasta", 42000m, null },
                    { 13, 3, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Crispy golden chicken cutlet served with aromatic Japanese curry sauce", "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=500", true, "Chicken Katsu Curry Rice", 45000m, null },
                    { 14, 3, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Juicy beef patty, melted cheddar, caramelized onion in brioche bun", "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500", true, "Classic Beef Burger", 48000m, null },
                    { 15, 4, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Crispy shoestring fries seasoned with sea salt and truffle dip", "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500", true, "French Fries with Truffle Mayo", 25000m, null },
                    { 16, 4, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Tender wings glazed with sweet and spicy barbecue sauce", "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500", true, "Crispy Chicken Wings (6 pcs)", 32000m, null },
                    { 17, 4, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Combo basket of french fries, chicken nuggets, and sausage bites", "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=500", true, "Fried Platter Combo", 35000m, null },
                    { 18, 4, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Corn tortilla chips layered with molten cheese sauce and salsa", "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=500", true, "Nachos with Guacamole & Cheese", 28000m, null },
                    { 19, 5, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Flaky, buttery French viennoiserie baked fresh every morning", "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500", true, "Butter Croissant", 22000m, null },
                    { 20, 5, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Creamy caramelized cheesecake with rich Spanish vanilla notes", "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500", true, "Burnt Basque Cheesecake", 32000m, null },
                    { 21, 5, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Espresso soaked ladyfingers layered with whipped mascarpone cream", "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500", true, "Classic Tiramisu", 35000m, null },
                    { 22, 5, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Warm dark chocolate brownie served with vanilla ice cream scoop", "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500", true, "Fudgy Chocolate Brownie", 26000m, null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Categories_Name",
                table: "Categories",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Menus_CategoryId",
                table: "Menus",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_MenuId",
                table: "OrderItems",
                column: "MenuId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_OrderId",
                table: "OrderItems",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_OrderNumber",
                table: "Orders",
                column: "OrderNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Orders_TableId",
                table: "Orders",
                column: "TableId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_UserId",
                table: "Orders",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Tables_Number",
                table: "Tables",
                column: "Number",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrderItems");

            migrationBuilder.DropTable(
                name: "Menus");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "Tables");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
