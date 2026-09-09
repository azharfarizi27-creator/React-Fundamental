using System.Net;
using System.Text.Json;
using Caffera.Backend.DTOs.Common;

namespace Caffera.Backend.Middlewares;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var method = context.Request.Method;
        var path = context.Request.Path;
        var queryString = context.Request.QueryString.HasValue ? context.Request.QueryString.Value : string.Empty;
        var user = context.User.Identity?.IsAuthenticated == true
            ? $"{context.User.Identity.Name ?? "User"} (Claims ID: {context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "-"})"
            : "Anonymous";

        // Print high-visibility colored error banner to console for developers / server administrators
        Console.ForegroundColor = ConsoleColor.Red;
        Console.WriteLine("\n" + new string('=', 75));
        Console.WriteLine($"💥 [UNHANDLED EXCEPTION ERROR]");
        Console.WriteLine(new string('=', 75));
        Console.ResetColor();

        Console.ForegroundColor = ConsoleColor.Yellow;
        Console.WriteLine($"🕒 Waktu          : {DateTime.Now:yyyy-MM-dd HH:mm:ss}");
        Console.WriteLine($"🌐 Endpoint       : [{method}] {path}{queryString}");
        Console.WriteLine($"👤 User           : {user}");
        Console.WriteLine($"❌ Exception Type : {exception.GetType().FullName}");
        Console.WriteLine($"💬 Pesan Error    : {exception.Message}");

        if (exception.InnerException != null)
        {
            Console.ForegroundColor = ConsoleColor.Magenta;
            Console.WriteLine($"🔍 Inner Exception: {exception.InnerException.GetType().Name} - {exception.InnerException.Message}");
        }

        Console.ForegroundColor = ConsoleColor.DarkGray;
        Console.WriteLine($"📍 Stack Trace:");
        Console.WriteLine(exception.StackTrace);
        Console.ForegroundColor = ConsoleColor.Red;
        Console.WriteLine(new string('=', 75) + "\n");
        Console.ResetColor();

        // Also log via ILogger for standard log sinks
        _logger.LogError(exception, "Unhandled exception occurred while processing request [{Method}] {Path}", method, path);

        // Return structured JSON response to client
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        // Security Principle #8: Never expose raw database / SQL exception details in production
        ApiResponse<object> response;
        if (_env.IsDevelopment())
        {
            response = ApiResponse<object>.FailResult(
                $"Terjadi kesalahan internal pada server: {exception.Message}",
                exception.InnerException != null ? new List<string> { exception.InnerException.Message } : null
            );
        }
        else
        {
            response = ApiResponse<object>.FailResult(
                "Terjadi kesalahan internal pada server. Silakan hubungi administrator.",
                null
            );
        }

        var jsonOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        var json = JsonSerializer.Serialize(response, jsonOptions);

        await context.Response.WriteAsync(json);
    }
}
