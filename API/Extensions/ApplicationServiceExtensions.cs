using Application.Activities;
using Application.Core;
using Application.Interfaces;
using FluentValidation;
using FluentValidation.AspNetCore;
using infrastructure.Photos;
using infrastructure.Security;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Serilog;

namespace API.Extensions;

// ReSharper disable CommentTypo
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
          
          /* сваггер */
          services.AddSwaggerGen();

          /*  добавляем в сервис политику
          чтобы разрешить любой HTTP запрос */
          services.AddCors(option =>
          {
               option.AddPolicy("CorsPolicy", policy =>
               {
                    policy
                         .AllowAnyMethod()
                         .AllowAnyHeader()
                         .AllowCredentials()
                         .WithOrigins("http://localhost:3000");
               });
          });          
         
           /*  Создаем сервис медиарт и указываем тип где находится наш обработчик запроса */
          services.AddMediatR(typeof(List.Handler).Assembly);    

          /* Подключаем autoMapper в наши сервисы, указываем путь и указываем свойство Assembly
          что говорит о том что мы хотим использовать нашу сборку чтобы найти все обьекты*/
          services.AddAutoMapper(typeof(MappingProfiles).Assembly);

          /* сервис автовалидации */
          services.AddFluentValidationAutoValidation();
          
          /* добавляем все валидоторы описанные в сборке типа Create  */
          services.AddValidatorsFromAssemblyContaining<Create>();

          /* добавляем доступ к контексту */
          services.AddHttpContextAccessor();
          
          /* регистрируем зависимость для доступа к контексту через IUserAccessor
           который при запросе будет содержать экземпляр UserAccessor в конструкторе которого
           будет IHttpContextAccessor 
           */
          services.AddScoped<IUserAccessor,UserAccessor>();
          
          /* добавляем сервис конфигурации нашего Cloudinary */
          services.Configure<CloudinarySettings>(config.GetSection("Cloudinary"));

          /* добавяем сервис загрузки/удаления фотографий */
          services.AddScoped<IPhotoAccessor, PhotoAccessor>();

          /* добавляем SignalR в сервисы */
          services.AddSignalR();

          /* добавляем Serilog */
          services.AddSerilog();


          #region Logger

          /* добавляем логгер */
          services.AddLogging(loggingBuilder =>
          {
               loggingBuilder
                    .AddConsole();
               
               loggingBuilder
                    .AddDebug();
          });

          #endregion

          return services;
     }
}