using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments;

public class Create
{
    public class Command : IRequest<Result<CommentDto>>
    {
        public Guid ActivityId { get; set; }
        public string Body { get; set; }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(c => c.Body).NotEmpty();
            }
        }
    }

    public class Handler : IRequestHandler<Command, Result<CommentDto>>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;
        private readonly IMapper _mapper;

        public Handler(DataContext context, IUserAccessor userAccessor, IMapper mapper )
        {
            _context = context;
            _userAccessor = userAccessor;
            _mapper = mapper;
        }
        
        public async Task<Result<CommentDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            /* получаем мероприятие */
             var activity = await _context.Activities
                    .Include(x => x.Comments)
                    .ThenInclude(x => x.Author)
                    .ThenInclude(x => x.Photos)
                    .FirstOrDefaultAsync(x => x.Id == request.ActivityId, cancellationToken: cancellationToken);


            /* проверяем activity */
            if (activity == null) return null;
            
            /* получаем пользователя */
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName(), cancellationToken: cancellationToken);

            /* проверяем user */
            if (user == null) return null;

            /* осздаем комментарий */
            var comments = new Comment()
            {
                Id = Guid.NewGuid().ToString(),
                Author = user,
                Activity = activity,
                Body = request.Body
            };
            
            /* добавляем комментарий в коллекцию */
            activity.Comments.Add(comments);

            /* сохраняем изменения */
            var success = await _context.SaveChangesAsync(cancellationToken) > 0;

            /* возвращаем результат */
            return success
                ? Result<CommentDto>.Success(_mapper.Map<CommentDto>(comments))
                : Result<CommentDto>.Failure("Failed to add comment");
        }
    }
}