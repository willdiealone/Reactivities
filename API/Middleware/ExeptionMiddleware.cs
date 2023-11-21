using System.Net;
using System.Text.Json;
using Application.Core;
using Serilog;

namespace API.Middleware;


public class ExeptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IHostEnvironment _environment;

    public ExeptionMiddleware(RequestDelegate next, IHostEnvironment environment)
    {
        _next = next;
        _environment = environment;
    }

    public async Task InvokeAsync(HttpContext httpContext)
    {
        try
        {
            await _next(httpContext);
        }
        catch (Exception e)
        {
            Log.Logger.Error(e,e.Message);
            httpContext.Response.ContentType = "application/json";
            httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var response = _environment.IsDevelopment()
                ? new AppException(httpContext.Response.StatusCode, e.Message, e.StackTrace)
                : new AppException(httpContext.Response.StatusCode, "Internal Server Error");
            
            /*устанавливаем политику имен в ответе json */
            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

            var json = JsonSerializer.Serialize(response, options);

            await httpContext.Response.WriteAsync(json);
        }
    }
}