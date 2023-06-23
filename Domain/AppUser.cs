using Microsoft.AspNetCore.Identity;

namespace Domain;

public class AppUser : IdentityUser
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
