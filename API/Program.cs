global using Activity = Domain.Activity;
using API.Extensions;
using API.Middleware;
using API.SignalR;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Serilog;

/* Создаем WebApplicationBuilder */
var builder = WebApplication.CreateBuilder(args);

#region DI

/*  В этом месте мы добавляем сервисы в контейнер */
builder.Services.AddControllers(option =>
{
    /* настраиваем политику (нам нужен авторизованный пользователь) */
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    
    /* добавляем политику (теперь каждый ендпоинт будет ждать аутентифицированного пользователя)*/
    option.Filters.Add(new AuthorizeFilter(policy));
    
});

/* метод расширения с описанными в нем сервисами */
builder.Services.AddApplicationServices(builder.Configuration);

/* сервис идентификации */
builder.Services.AddIdentityServices(builder.Configuration);

builder.Host.UseSerilog();

/* сохдание логгера */
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .CreateLogger();

#endregion

/* Создаем наше приложение */
var app = builder.Build();

#region Middleware

/* ловим exeption на выходе */
app.UseMiddleware<ExeptionMiddleware>();

/* Другая основная область здесь — это часть, предназначенная для настройки конвейера HTTP-запросов.*/
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
/* политика заголовков */
app.UseCors("CorsPolicy");

/* аутентификация */
app.UseAuthentication();

/* авторизация */
app.UseAuthorization();

// Добавляем промежуточное ПО для обработки default files
app.UseDefaultFiles();
// Добавляем промежуточное ПО для обработки статических файлов
app.UseStaticFiles();

/* контроллеры маршрутизации */
app.MapControllers();
app.MapHub<ChatHub>("/chat");

app.MapFallbackToController("Index","FallBack");

#endregion

#region WorkWithDB

/* Создаем область для того чтобы создать зависимость для нашей базы данных */
using var scope = app.Services.CreateScope();

/* Создаем обьект IServiceProvider, для того,
 Чтобы работать с зависимостями зарегистрированными в контойнере зависимостей */
var services = scope.ServiceProvider;

try
{
    /* Получаем зараегестрированную службу */
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    /* Вызываем миграцию */
    await context.Database.MigrateAsync();
    /* Добаляем данны в нашу бд */
    await Seed.SeedData(context,userManager);
}
catch (Exception e)
{
    /* Получение ошибки */
    var logger = services.GetRequiredService<ILogger<Program>>();

    /* Регистрация ошибки в логах */
    logger.LogError(e, "An error occured during migrations");

}

#endregion

app.Run();