global using Activity = Domain.Activity;
using API.Extensions;
using API.Middleware;
using Microsoft.EntityFrameworkCore;
using Persistence;


/* Создаем WebApplicationBuilder */
var builder = WebApplication.CreateBuilder(args);

#region DI

/*  В этом месте мы добавляем сервисы в контейнер */
builder.Services.AddControllers();

builder.Services.AddApplicationServices(builder.Configuration);

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

app.UseCors("CorsPolicy");

app.UseAuthorization();

app.MapControllers();

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

/* Вызываем миграцию */
await context.Database.MigrateAsync();

/* Добаляем данны в нашу бд */
await Seed.SeedData(context);

}
catch (Exception e)
{
/* Получение ошибки */
var logger = services.GetRequiredService<ILogger<Program>>();

/* Регистрация ошибки в логах */
logger.LogError(e, "An error occured during migrations");

}

#endregion

/* Go! */
app.Run();