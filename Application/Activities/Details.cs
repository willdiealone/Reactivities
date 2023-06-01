using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Persistence;

namespace Application;

/// <summary>
/// Класс который делает более конкретный запрос
/// </summary>
public class Details
{
    public class Query : IRequest<Activity>
    {
        public Guid Id { get; set; }
    }
    
    public class Handler : IRequestHandler<Query,Activity>
    {
        private readonly DataContext _context;

        public Handler(DataContext _context)
        {
            this._context = _context;
        }
        public async Task<Activity> Handle(Query request, CancellationToken cancellationToken)
        {
            return await _context.Activities.FindAsync(request.Id);
        }
    }
}