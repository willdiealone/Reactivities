using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace infrastructure.Security;

                                /* IAuthorizationRequirement определяет необходимые свойства, методы для проверки
                                   удовлетворяет ли пользователь определенным требованиям авторизации */
public class IsHostRequirement : IAuthorizationRequirement
{
    
}
                                        /* AuthorizationHandler абстрактный класс который редизует
                                           логику авторизации для требования IsHostRequirement */
public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
{
    private readonly DataContext _dbContext;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public IsHostRequirementHandler(DataContext dbContext, IHttpContextAccessor httpContextAccessor)
    {
        _dbContext = dbContext;
        _httpContextAccessor = httpContextAccessor;
    }
    
    /* метод реализует логику проверки авторизации  */
    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
    {
        /* считываем ID из полезной нагрузки(payload) токена*/
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

        /* возвращаем Task.CompletedTask(возвр. задача без результата/ авт. не пройдена) или просто return */
        if (userId == null) return;

        /* считываем id с запроса и парсим в Guid */
        var activityId = Guid.Parse(_httpContextAccessor.HttpContext?.Request.RouteValues
            .FirstOrDefault(x => x.Key == "id").Value.ToString() ?? string.Empty);

        /* находим участника текущего события по AppUser.id и Activity.id
           применяем AsNoTracking() для того чтобы измежать бага с удалением участников мероприятия
           после того как завершиться наш обработчик */
        var attendee = await _dbContext.ActivityAttendees.AsNoTracking()
            .FirstOrDefaultAsync(x=>x.AppUser.Id == userId && x.ActivityId == activityId);

        /* если авторизуемый чел не участник возвращаемся без результата */
        if (attendee == null) return;
        
        /* если наш участник хост то метод Succeed */
        if(attendee.IsHost) context.Succeed(requirement);
        
    }
}