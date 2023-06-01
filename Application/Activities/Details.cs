using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Logging;
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
        private readonly ILogger<Details> _logger;

        public Handler(DataContext _context,ILogger<Details> _logger)
        {
            this._context = _context;
            this._logger = _logger;
        }
        public async Task<Activity> Handle(Query request, CancellationToken cancellationToken)
        {
            try
            {
                if (cancellationToken.IsCancellationRequested)
                {
                    cancellationToken.ThrowIfCancellationRequested();
                }
            }
            catch (Exception)
            {
                _logger.LogInformation("Task was canseled");
            }
            
            return await _context.Activities.FindAsync(request.Id);
        }
    }
}