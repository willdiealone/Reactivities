using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Persistence;
using Serilog;

namespace Application.Activities;

public class List
{
    public class Query : IRequest<Result<PageList<ActivityDto>>>
    {
        public ActivityParams Params { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<PageList<ActivityDto>>>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IUserAccessor _userAccessor;

        public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
        {
            _context = context;
            _mapper = mapper;
            _userAccessor = userAccessor;
        }

        public async Task<Result<PageList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            // Получаем активности даты которых больше текущей
            // сортируем по датам, маппим участников,
            // приводим к AsQueryable        
            var query = _context.Activities
                .Where(a => a.Date >= request.Params.StartDate)
                .OrderBy(d => d.Date)
                .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider,
                    new { currentUserName = _userAccessor.GetUserName() })
                .AsQueryable();

            // Проверяем если собатие не отменено и не хост, то вернуть все мероприятия где имя 
            // из токена с текущего запроса фигурирует в участниках
            // добавляем логику к предыдущему query
            if (request.Params.IsGoing && !request.Params.IsHost)
            {
                query = query.Where(x => x.Attendees.Any(a => a.UserName == _userAccessor.GetUserName()));
            }

            // Если хост и событие не отменено, то
            // если имя хоста совпадает с именем их токена вернуть где мероприятия он хост
            if (request.Params.IsHost && !request.Params.IsGoing)
            {
                query = query.Where(x => x.HostUserName == _userAccessor.GetUserName());
            }

            Log.Information("Get Activties => {@query}", query);

            return Result<PageList<ActivityDto>>.Success(await PageList<ActivityDto>.CreateAsync(query,
                request.Params.PageNumber, request.Params.PageSize));
        }
    }
}