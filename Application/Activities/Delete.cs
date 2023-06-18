using Application.Core;
using MediatR;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application;

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

        public Handler(DataContext _context)
        {
            this._context = _context;            
        }

        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {            
            var activity = await _context.Activities.FindAsync(new object[] {request.Id}, cancellationToken);

            if (activity == null) return null;

            _context.Remove(activity);

            var result =  await _context.SaveChangesAsync(cancellationToken) > 0;

            if (!result) Result<Unit>.Failure("Failed to delete");

            return Result<Unit>.Success(Unit.Value);
        }
    }
}