using Application.Activities;
using Application.Core;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application;

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

        public Handler(DataContext _context)
        {
            this._context = _context;
        }

        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            // Приводим дату к UTC
            if (request.Activity.Date.Kind != DateTimeKind.Utc)
            {
                request.Activity.Date = DateTime.SpecifyKind(request.Activity.Date, DateTimeKind.Utc);
            }

            _context.Activities.Add(request.Activity);

            var result = await _context.SaveChangesAsync(cancellationToken) > 0;

            if(!result) return Result<Unit>.Failure("Failed to Create");

            return Result<Unit>.Success(Unit.Value);
        }
    }

}