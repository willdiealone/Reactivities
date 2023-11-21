
using Application.Core;
using Application.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles;

public class Edit
{
    public class Command : IRequest<Result<Unit>>
    {
        public string DisplayName { get; set; }
        public string Bio { get; set; }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(c => c.DisplayName).NotEmpty();
            }
        }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
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
            /* прокидываем юзера из базы */
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUserName());

            /* проверяем на null */
            if (user == null) return null;

            /* изменяем поле DisplayName */
            user.DisplayName = request.DisplayName ?? user.DisplayName;

            /* изменяем поле bio */
            user.Bio = request.Bio ?? user.Bio;

            /* говорм entity что наш обьект обновлен и нужно его обновить */
            _context.Entry(user).State = EntityState.Modified;
            
            /* сохраняем измененния */
            var result = await _context.SaveChangesAsync() > 0;

            /* возвращаем результат */
            return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem updating profile");
        }
    }
}