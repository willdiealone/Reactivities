using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles;

public class Details  // каласс для получения деталей профиля другими пользователями
{
    public class Query : IRequest<Result<Profile>>
    {
        public string UserName { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<Profile>>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public Handler(DataContext context,IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        
        public async Task<Result<Profile>> Handle(Query request, CancellationToken cancellationToken)
        {
            /* маппим в Profile по UserName  и возвращаем из базы в user */
            var user = await _context.Users
                .ProjectTo<Profile>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x=>x.UserName == request.UserName);

            return Result<Profile>.Success(user);
        }
    }
}