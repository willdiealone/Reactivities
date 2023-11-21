using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

// ReSharper disable CommentTypo

public class RegisterDto
{
    [Required]
    public string DisplayName { get; set; }
    
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    
    [Required]
    /* валидация пароля (цифры,буквы,Буквы) размером от 4 до 8 символов */
    [RegularExpression("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,16}$",ErrorMessage = "Password must be complex")]
    public string Password { get; set; }
    
    [Required]
    public string UserName { get; set; }
}