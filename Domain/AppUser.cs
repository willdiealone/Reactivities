

using Microsoft.AspNetCore.Identity;

namespace Domain;

// ReSharper disable CommentTypo

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
    
    public ICollection<ActivityAttendee> Activities { get; set; }
}
