using Microsoft.AspNetCore.Identity;

namespace Domain;

// ReSharper disable CommentTypo

public class AppUser : IdentityUser                 // модель для хранения пользователей в хранилище
{
    /// <summary>
    /// Имя
    /// </summary>
    public string DisplayName { get; set; }
    
    /// <summary>
    /// Описание
    /// </summary>
    public string Bio { get; set; }
    
    
}
