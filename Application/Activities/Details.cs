using Application.Core;
using Domain;
using MediatR;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application;

/// <summary>
/// Класс который делает более конкретный запрос
/// </summary>
public class Details
{
    public class Query : IRequest<Result<Activity>>
    {
        public Guid Id { get; set; }
    }
    
    public class Handler : IRequestHandler<Query,Result<Activity>>
    {
        private readonly DataContext _context;        

        public Handler(DataContext _context)
        {
            this._context = _context;            
        }
        public async Task<Result<Activity>> Handle(Query request, CancellationToken cancellationToken)
        {
            return Result<Activity>.Success(await _context.Activities.FindAsync( new object[] {request.Id},cancellationToken));             
        }
    }
}