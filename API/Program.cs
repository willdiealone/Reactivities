using Application;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

/* Создаем WebApplicationBuilder */
var builder = WebApplication.CreateBuilder(args);

#region DI

/*  В этом месте мы добавляем сервисы в контейнер */
builder.Services.AddControllers();

/*  Мы можем добавить сервисы, чтобы расширить функциональность нашей логики, которую мы создаем. */
builder.Services.AddEndpointsApiExplorer();

/*  Создаем сервив нашей Бд, а так же указываем строку подключения */
builder.Services.AddDbContext<DataContext>(option =>
{
    option.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnectionString"));
});

/*  Создаем сервис медиарт и указываем тип где находится наш обработчик запроса */
builder.Services.AddMediatR(typeof(List.Handler));

/*  добавляем в сервис политику
  чтобы разрешить любой HTTP запрос */
builder.Services.AddCors(option =>
{
    option.AddPolicy("CorsPolicy", policy =>
    {
        policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:3000");
    });
});

/* Добавляем сервис сваггер */
builder.Services.AddSwaggerGen();

#endregion

/* Создаем наше приложение */
var app = builder.Build();

#region Middleware

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
