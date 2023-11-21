using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Persistence;
using Microsoft.EntityFrameworkCore;

namespace Application.Profiles
{
    public class ListActivities
    {
        public class Query : IRequest<Result<List<UserActivityDto>>>
        {
            public string Predicate { get; set; }
            public string UserName { get; set; }
        }
        public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>>
        {
            private readonly DataContext context;
            private readonly IMapper mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                this.context = context;
                this.mapper = mapper;
            }

            public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {

                var query = context.ActivityAttendees
                    .Where(a => a.AppUser.UserName == request.UserName)
                    .OrderBy(a => a.Activity.Date)
                    .ProjectTo<UserActivityDto>(mapper.ConfigurationProvider)
                    .AsQueryable();

                query = request.Predicate switch
                {
                    "past" => query.Where(a => a.Date <= DateTime.UtcNow),
                    "hosting" => query.Where(a => a.HostUserName == request.UserName),
                    _ => query.Where(a => a.Date >= DateTime.UtcNow),
                };

                var activities = await query.ToListAsync(); 
                
                return Result<List<UserActivityDto>>.Success(activities);
            }
        }
    }
}