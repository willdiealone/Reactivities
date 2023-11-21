using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities;

/// <summary>
/// Класс который делает более конкретный запрос
/// </summary>
public class Details
{
    public class Query : IRequest<Result<ActivityDto>>
    {
        public Guid Id { get; set; }
    }
    
    public class Handler : IRequestHandler<Query,Result<ActivityDto>>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IUserAccessor _userAccessor;

        public Handler(DataContext context,IMapper mapper,IUserAccessor userAccessor)
        {
            _context = context;
            _mapper = mapper;
            _userAccessor = userAccessor;
        }
        public async Task<Result<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var activities = await _context.Activities
                .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, 
                    new {currentUserName = _userAccessor.GetUserName()})
                .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken: cancellationToken);
            
            return Result<ActivityDto>.Success(activities);             
        }
    }
}