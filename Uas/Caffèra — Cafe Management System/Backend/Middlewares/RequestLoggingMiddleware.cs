using System.Diagnostics;

namespace Caffera.Backend.Middlewares;

public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();
        var request = context.Request;
        var method = request.Method;
        var path = request.Path.Value ?? "/";
        var queryString = request.QueryString.HasValue ? request.QueryString.Value : string.Empty;
        var ip = context.Connection.RemoteIpAddress?.ToString() ?? "Local";

        // Ignore swagger static file requests spam in console if desired, but keep API logs clear
        var isSwaggerAsset = path.StartsWith("/swagger") && (path.EndsWith(".js") || path.EndsWith(".css") || path.EndsWith(".png"));

        if (!isSwaggerAsset)
        {
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.Write($"[HTTP IN]  ➡️  ");
            Console.ResetColor();
            Console.WriteLine($"{DateTime.Now:HH:mm:ss} | {method,-6} {path}{queryString} (Client: {ip})");
        }

        try
        {
            await _next(context);
        }
        finally
        {
            stopwatch.Stop();
            var statusCode = context.Response.StatusCode;
            var elapsedMs = stopwatch.ElapsedMilliseconds;

            if (!isSwaggerAsset)
            {
                var (color, icon, statusText) = GetStatusVisual(statusCode);

                Console.ForegroundColor = color;
                Console.Write($"[HTTP OUT] {icon} ");
                Console.ResetColor();
                Console.Write($"{DateTime.Now:HH:mm:ss} | Status: ");

                Console.ForegroundColor = color;
                Console.Write($"{statusCode} {statusText}");
                Console.ResetColor();

                Console.WriteLine($" | {elapsedMs}ms | [{method}] {path}");
            }
        }
    }

    private static (ConsoleColor Color, string Icon, string StatusText) GetStatusVisual(int statusCode)
    {
        return statusCode switch
        {
            >= 200 and < 300 => (ConsoleColor.Green, "🟢", "OK"),
            >= 300 and < 400 => (ConsoleColor.Blue, "🔵", "Redirect"),
            400 => (ConsoleColor.Yellow, "⚠️ ", "Bad Request"),
            401 => (ConsoleColor.Yellow, "🔒", "Unauthorized"),
            403 => (ConsoleColor.Yellow, "🚫", "Forbidden"),
            404 => (ConsoleColor.DarkYellow, "🔍", "Not Found"),
            >= 400 and < 500 => (ConsoleColor.Yellow, "⚠️ ", "Client Error"),
            >= 500 => (ConsoleColor.Red, "❌", "Server Error"),
            _ => (ConsoleColor.White, "ℹ️ ", "Unknown")
        };
    }
}
