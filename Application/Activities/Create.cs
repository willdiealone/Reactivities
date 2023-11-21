using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities;

public class Create
{   
    public class Command : IRequest<Result<Unit>>
    {
        public Activity Activity { get; set; }
    }

    public class CommandValidator : AbstractValidator<Command>{
        public CommandValidator()
        {
            RuleFor( x => x.Activity).SetValidator(new ActivityValidator());
        }
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
            // Приводим дату к UTC
            if (request.Activity.Date.Kind != DateTimeKind.Utc)
            {
                request.Activity.Date = DateTime.SpecifyKind(request.Activity.Date, DateTimeKind.Utc);
            }
            
            // сравниваем имя пользователя из хранилища и из токена (передаем в user) 
            var user = await _context.Users.FirstOrDefaultAsync(u =>
                u.UserName == _userAccessor.GetUserName(), cancellationToken);
            
            // хост добавляет учасника события
            var attendee = new ActivityAttendee()
            {
                AppUser = user,
                Activity = request.Activity,
                IsHost = true
            };
            
            // учатсник добавляется в коллекцию 
            request.Activity.Attendees.Add(attendee);
            
            // добавляем участника в таблицу Activities
            _context.Activities.Add(request.Activity);
            
            // проверка на успех
            var result = await _context.SaveChangesAsync(cancellationToken) > 0;
            
            /* возвращаем результат */
            return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to Create");
        }
    }

}