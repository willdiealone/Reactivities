using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities;

public class UpdateAttendance
{
    public class Command : IRequest<Result<Unit>>
    {
        public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Command,Result<Unit>>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;

        public Handler(DataContext context,IUserAccessor userAccessor)
        {
            _context = context;
            _userAccessor = userAccessor;
        }
        
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            /* находим мероприятие которое включает в себя Attendees и AppUser */
            var activity = await _context.Activities
                .Include(a => a.Attendees)
                .ThenInclude(x => x.AppUser)
                .FirstOrDefaultAsync(a => a.Id == request.Id,cancellationToken);
    
            /* проверяем мероприятие на null*/
            if (activity == null) return null;
    
            /* получаем пользователя из базы и токена */
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == _userAccessor
                .GetUserName(),cancellationToken);

            /* проверяем пользователя на null */
            if (user == null) return null;
    
            /* добавляем участника который является хостом мероприятия(по id запроса) */
            var hostUserName = activity.Attendees.FirstOrDefault(x => x.IsHost)?.AppUser?.UserName;
            
            /* проверяем является ли автор запроса участником текущего события если да ? attendance : null */
            var attendance = activity.Attendees.FirstOrDefault(a => a.AppUser.UserName == user.UserName);

            /* если автор запроса(является участником) и хостом мероприятия
               то IsCanselled = false || true (хост может отменить или возобновить
               мероприятие)
             */
            if (attendance != null && hostUserName == user.UserName)
                activity.IsCanсelled = !activity.IsCanсelled;
            
            /* если автор запроса(является участником) и не является хостом мероприятия
               то этот пользователь может удалить себя из мероприятия)
             */
            if (attendance != null && hostUserName != user.UserName)
                activity.Attendees.Remove(attendance);
            
            /* если автор запроса(не является участником) 
               то этот пользователь может добавить себя в мероприятие)
             */
            if (attendance == null)
            {
                attendance = new ActivityAttendee()
                {
                    AppUser = user,
                    Activity = activity,
                    IsHost = false
                };
                /* Добавляем текущего пользователя в участники */
              activity.Attendees.Add(attendance);
            }
            
            /* сохраняем изменения в базе данных */
            var result = await _context.SaveChangesAsync() > 0;

            /* если успешно возвращаем успех если нет возвращаем "Problem updating attendance" */
            return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem updating attendance");
        }
    }
}