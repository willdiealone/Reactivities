using System.Text;
using API.Services;
using Domain;
using infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Persistence;

namespace API.Extensions;

public static class IdentityServiceExtensions
{
    public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddIdentityCore<AppUser>(options =>
        {
            options.Password.RequireNonAlphanumeric = false;
            
        }).AddEntityFrameworkStores<DataContext>().AddSignInManager<SignInManager<AppUser>>();

        /* создаем ключ что бы передать его нашей проверке */
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("super secret key super secret key super secret key super secret key"));
        
        /* сервис аутентификации */
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                /* валидация токена */
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
                /* валидация токена при каждом сообщении*/
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        /* извлекаем токен */
                        var accessToken = context.Request.Query["access_token"];
                        var path = context.HttpContext.Request.Path;

                        if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/chat"))
                        {
                            context.Token = accessToken;
                        }
                        return Task.CompletedTask;
                    }
                };
            });
        
        /* политика авторизации */
        services.AddAuthorization(options =>
        {
            options.AddPolicy("IsActivityHost", opt =>
            {
                opt.Requirements.Add(new IsHostRequirement());
            });
        });

        services.AddScoped<IAuthorizationHandler, IsHostRequirementHandler>();

        /* наш токен */
        services.AddScoped<TokenService>();

        return services; 
    }
}