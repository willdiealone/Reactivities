using System.Security.Claims;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace infrastructure.Security;

public class UserAccessor : IUserAccessor
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserAccessor(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }
    
     /// <summary>
    /// мтод возвращает имя из токена
    /// _httpContextAccessor для того что б получить досуп к контексту
    /// </summary>
    /// <returns>Имя из запроса</returns>
    public string GetUserName()
    {
        return _httpContextAccessor.HttpContext!.User.FindFirstValue(ClaimTypes.Name);
    }
}