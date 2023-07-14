using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Serilog;

namespace Application.Activities;

public class List
{
    public class Query : IRequest<Result<List<ActivityDto>>>{}
    
    public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public Handler(DataContext context,IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
    
        public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            /* добавляем в список мероприятие, участников и хоста*/
            var activities = await _context.Activities
                .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            Log.Information("Get Activties => {@activities}",activities);
            
            /* возвращаем список */
            return Result<List<ActivityDto>>.Success(activities);
        }
    }
}