using Application.Core;
using MediatR;
using Persistence;

namespace Application.Activities;

/// <summary>
/// Класс удаления обьекта
/// </summary>
public class Delete
{
    public class Command : IRequest<Result<Unit>>
    {
        public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Command,Result<Unit>>
    {
        private readonly DataContext _context;        

        public Handler(DataContext context)
        {
            _context = context;            
        }

        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {            
            var activity = await _context.Activities.FindAsync(new object[] {request.Id}, cancellationToken);

            if (activity == null) return null;

            _context.Remove(activity);

            var result =  await _context.SaveChangesAsync(cancellationToken) > 0;

            /* возвращаем результат */
            return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to Create");
        }
    }
}