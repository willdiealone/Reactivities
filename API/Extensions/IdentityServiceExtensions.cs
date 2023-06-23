using Domain;
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
            options.Password.RequireDigit = true;
            options.Password.RequiredUniqueChars = 2;
            options.Password.RequireUppercase = true;

        }).AddEntityFrameworkStores<DataContext>();

        services.AddAuthentication();
                
        return services;
    }
}