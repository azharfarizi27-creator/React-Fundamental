using System.Text;
using System.Threading.RateLimiting;
using Caffera.Backend.Data;
using Caffera.Backend.Helpers;
using Caffera.Backend.Middlewares;
using Caffera.Backend.Repositories.Implementations;
using Caffera.Backend.Repositories.Interfaces;
using Caffera.Backend.Services.Implementations;
using Caffera.Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// ========================================================
// 0. CONSOLE LOGGING CONFIGURATION
// ========================================================
builder.Logging.ClearProviders();
builder.Logging.AddSimpleConsole(options =>
{
    options.IncludeScopes = false;
    options.SingleLine = true;
    options.TimestampFormat = "[HH:mm:ss] ";
});

// ========================================================
// 1. DATABASE CONTEXT
// ========================================================
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ========================================================
// 2. JWT AUTHENTICATION (Security Principles #3 & #4)
// ========================================================
var jwtKey = builder.Configuration["Jwt:Key"] ?? "CafferaSecretKey_SuperSecure_UAS_Fullstack_2026_Key_MustBeLongEnough!";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "CafferaApi";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "CafferaClient";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// ========================================================
// 3. CORS CONFIGURATION (Security Principle #9)
// ========================================================
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() 
    ?? new[] { "http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });

    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ========================================================
// 4. RATE LIMITING (Security Principle #11)
// ========================================================
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddFixedWindowLimiter("AuthLimiter", opt =>
    {
        opt.PermitLimit = 10;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 2;
    });
});

// ========================================================
// 5. DEPENDENCY INJECTION (Repositories & Services)
// ========================================================
builder.Services.AddScoped<JwtHelper>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IOrderRepository, OrderRepository>();

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IMenuService, MenuService>();
builder.Services.AddScoped<ITableService, TableService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<ISalesService, SalesService>();

// ========================================================
// 6. CONTROLLERS & SWAGGER WITH JWT SUPPORT
// ========================================================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Caffèra API — Cafe Management System",
        Version = "v1",
        Description = "RESTful API backend untuk Caffèra Cafe Management System (UAS React Fundamental & Fullstack)"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Masukkan JWT Token. Contoh: Bearer {token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// ========================================================
// 7. CUSTOM DIAGNOSTIC & LOGGING MIDDLEWARES
// ========================================================
// 1) Catch all unhandled exceptions and prevent DB error leakage in production (Security Principle #8)
app.UseMiddleware<ExceptionMiddleware>();

// 2) Log all incoming HTTP requests and response durations
app.UseMiddleware<RequestLoggingMiddleware>();

// ========================================================
// 8. HTTP REQUEST PIPELINE
// ========================================================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Caffèra API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// ========================================================
// 9. DATABASE INITIALIZATION & STARTUP
// ========================================================
Console.ForegroundColor = ConsoleColor.Cyan;
Console.WriteLine(@"
   ______          ________                     
  / ____/___ _____/ __/ __/___  _________ _     
 / /   / __ `/ __/ /_/ /_/ __ \/ ___/ __ `/     
/ /___/ /_/ / /_/ __/ __/ /_/ / /  / /_/ /      
\____/\__,_/_/ /_/ /_/  \____/_/   \__,_/       
:: Caffèra Cafe Management System :: (v1.0)
");
Console.ResetColor();

try
{
    await DbInitializer.InitializeAsync(app.Services);
}
catch (Exception)
{
    Console.ForegroundColor = ConsoleColor.Yellow;
    Console.WriteLine("⚠️ Server tetap berjalan, namun beberapa fitur database mungkin tidak dapat diakses sebelum konfigurasi diperbaiki.\n");
    Console.ResetColor();
}

app.Run();
