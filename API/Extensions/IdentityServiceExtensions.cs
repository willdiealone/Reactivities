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

// ReSharper disable CommentTypo

public static class IdentityServiceExtensions
{
    public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddIdentityCore<AppUser>(options =>
        {
            options.Password.RequireNonAlphanumeric = false;
            
        }).AddEntityFrameworkStores<DataContext>()
            .AddSignInManager<SignInManager<AppUser>>();

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
        
        /*  */
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