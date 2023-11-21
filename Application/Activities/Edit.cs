using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities;

// ReSharper disable CommentTypo

/* Класс редактирования сущности (Activity) */
public class Edit
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
        private readonly IMapper _mapper;        

        public Handler(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {            
            // Приводим дату к UTC
            if (request.Activity.Date.Kind != DateTimeKind.Utc)
            {
                request.Activity.Date = DateTime.SpecifyKind(request.Activity.Date, DateTimeKind.Utc);
            }
         
            var activity = await _context.Activities.FindAsync(new object[] {request.Activity.Id}, cancellationToken);
         
            if(activity == null) return null;

            _mapper.Map(request.Activity, activity);
         
            var result = await _context.SaveChangesAsync(cancellationToken) > 0;
            
            /* возвращаем результат */
            return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to Create");
        }
    }

}