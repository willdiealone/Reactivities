using System.Text;
using API.Services;
using Application;
using Application.Activities;
using Application.Core;
using Application.Interfaces;
using FluentValidation;
using FluentValidation.AspNetCore;
using infrastructure.Security;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Persistence;

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
                    policy.AllowAnyMethod()
                              .AllowAnyHeader()
                              .WithOrigins("http://localhost:3000")
                              .AllowCredentials();
               });
          });          
         
           /*  Создаем сервис медиарт и указываем тип где находится наш обработчик запроса */
          services.AddMediatR(typeof(List.Handler));    

          /* Подключаем autoMapper в наши сервисы, указываем путь и указываем свойство Assembly
          что говорит о том что мы хотим использовать нашу сборку чтобы найти все обьекты*/
          services.AddAutoMapper(typeof(MappingProfiles).Assembly);

          /* сервис автовалидации */
          services.AddFluentValidationAutoValidation();
          
          /* добавляем все валидоторы описанные в сборке типа Create  */
          services.AddValidatorsFromAssemblyContaining<Create>();
          
          /* создаем ключ что бы передать его нашей проверке */
          var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("super secret key super secret " +
                                                                    "key super secret key super secret key"));
          
          /* сервис аутентификации */
          services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
               .AddJwtBearer(options =>
               {
                    options.TokenValidationParameters = new TokenValidationParameters()
                    {
                         ValidateIssuerSigningKey = true,
                         IssuerSigningKey = key,
                         ValidateIssuer = false,
                         ValidateAudience = false
                    };
               });
          
          /* наш токен */
          services.AddScoped<TokenService>();

          /* добавляем доступ к контексту */
          services.AddHttpContextAccessor();
          
          /* регистрируем зависимость для доступа к контексту через IUserAccessor
           который при запросе будет содержать экземпляр UserAccessor в конструкторе которого
           будет IHttpContextAccessor 
           */
          services.AddScoped<IUserAccessor,UserAccessor>();

          return services;
     }
}