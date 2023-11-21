using System.Security.Claims;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

// ReSharper disable CommentTypo

[AllowAnonymous]
[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly TokenService _tokenService;
    private readonly IConfiguration _config;

    public AccountController(UserManager<AppUser> userManager,TokenService tokenService,IConfiguration config)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _config = config;
    }
    
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        /* получаем боба по email с фотографией */
        var user = await _userManager.Users.Include(a => a.Photos)
            .FirstOrDefaultAsync(a => a.Email == loginDto.Email);

        if (user == null) return Unauthorized();

        var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

        if (result)
        {
            return CreateUserObject(user);
        }

        return Unauthorized();
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await _userManager.Users.AnyAsync(x => x.UserName == registerDto.UserName))
        {
            return BadRequest("Name is already taken");
            // ModelState.AddModelError("username", "Name is already taken" );
            // return ValidationProblem(ModelState);
        }
        
        if (await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
        {
            return BadRequest("Email is already taken");
            // ModelState.AddModelError("email", "Email is already taken" );
            // return ValidationProblem(ModelState);
        }

        var user = new AppUser()
        {
            DisplayName = registerDto.DisplayName,
            Email = registerDto.Email,
            UserName = registerDto.UserName
        };

        var result = await _userManager.CreateAsync(user,registerDto.Password);

        /* проверяем удался ли результат */
        if (result.Succeeded)
        {
            return CreateUserObject(user);
        }

        return BadRequest(result.Errors);
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        /* получаем текущего юзера с фото */
        var user = await _userManager.Users.Include(a=>a.Photos)
            .FirstOrDefaultAsync(x =>x.Email == User.FindFirstValue(ClaimTypes.Email)!);

        return CreateUserObject(user);
    }
    
    /// <summary>
    /// метод создает UserDto
    /// </summary>
    /// <param name="user">User из хранилища</param>
    /// <returns>UserDto</returns>
    private UserDto CreateUserObject(AppUser user)
    {
        return new UserDto()
        {
            DisplayName = user.DisplayName,
            Image = user?.Photos?.FirstOrDefault(p=>p.IsMain)?.Url,
            Token = _tokenService.CreateToken(user),
            UserName = user.UserName
        };
    }
}