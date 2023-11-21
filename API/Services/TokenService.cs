using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Domain;
using Microsoft.IdentityModel.Tokens;

namespace API.Services;

// ReSharper disable CommentTypo

public class TokenService
{
    /// <summary>
    /// поле для нашего супер секретного ключа
    /// </summary>
    private readonly IConfiguration _config;

    public TokenService(IConfiguration config)
    {
        _config = config;
    }
    
    /// <summary>
    /// метод создает Jwt
    /// </summary>
    /// <param name="user">User из хранилища</param>
    /// <returns>Jwt</returns>
    public string CreateToken(AppUser user)
    {
        /* создем полезную нагрузку */
        var claims = new List<Claim>()
        {
            new (ClaimTypes.Name, user.UserName!),
            new (ClaimTypes.NameIdentifier, user.Id),
            new (ClaimTypes.Email, user.Email!)
        };

        /* создаем ключ */
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["TokenKey"]!));
        
        /* создаем подпись signature */
        var creds = new SigningCredentials(key,SecurityAlgorithms.HmacSha512Signature);

        /* настройка токена */
        var tokenDescriptor = new SecurityTokenDescriptor()
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = creds
        };
        
        /* создание обработчика токена */
        var tokenHandler = new JwtSecurityTokenHandler();

        /* создание токена */
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }
}