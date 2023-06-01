using Domain;
using MediatR;
using Persistence;

namespace Application;

/* Класс удаления обьекта  */
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

            public Handler(DataContext _context)
            {
                this._context = _context;
            }
            
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Id);

                _context.Remove(activity);

                await _context.SaveChangesAsync();
                
                return Unit.Value;
            }
        }
    }
}