using Domain;
using MediatR;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application;

/// <summary>
/// Класс удаления обьекта
/// </summary>
public class Delete
{
    public class Command : IRequest
    {
        /// <summary>
        /// Id по которому будем находить обьект что бы удалить
        /// </summary>
        public Guid  Id { get; set; }
        
        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly ILogger<Delegate> _logger;

            public Handler(DataContext _context,ILogger<Delegate> _logger)
            {
                this._context = _context;
                this._logger = _logger;
            }
            
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
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
                var activity = await _context.Activities.FindAsync(request.Id);

                _context.Remove(activity);

                await _context.SaveChangesAsync();
                
                return Unit.Value;
            }
        }
    }
}