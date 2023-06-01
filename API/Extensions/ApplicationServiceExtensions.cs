using Application;
using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Extensions;

public static class ApplicationServiceExtensions
{
     public static IServiceCollection AddApplicationServices(this IServiceCollection services,
          IConfiguration config)
     {
          /*  Мы можем добавить сервисы, чтобы расширить функциональность нашей логики, которую мы создаем. */
          services.AddEndpointsApiExplorer();

          /*  Создаем сервив нашей Бд, а так же указываем строку подключения */
          services.AddDbContext<DataContext>(option =>
          {
               option.UseNpgsql(config.GetConnectionString("DefaultConnectionString"));
          });

          /*  Создаем сервис медиарт и указываем тип где находится наш обработчик запроса */
          services.AddMediatR(typeof(List.Handler));

          /* Подключаем autoMapper в наши сервисы, указываем путь и указываем свойство Assembly
          что говорит о том что мы хотим использовать нашу сборку чтобы найти все обьекты*/
          services.AddAutoMapper(typeof(MappingProfiles).Assembly);

          /*  добавляем в сервис политику
          чтобы разрешить любой HTTP запрос */
          services.AddCors(option =>
          {
               option.AddPolicy("CorsPolicy", policy =>
               {
                    policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:3000");
               });
          });

          /* Добавляем сервис сваггер */
          services.AddSwaggerGen();

          return services;
     }
}