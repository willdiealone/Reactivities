using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments;

public class List
{
    public class Query : IRequest<Result<List<CommentDto>>>
    {
        public Guid ActivityId { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<List<CommentDto>>>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public Handler(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<Result<List<CommentDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            /* берем список коментарием из базы данных */
            var comments = await _context.Comments
                .Where(a => a.Activity.Id == request.ActivityId)
                .OrderByDescending(x => x.CreateAt)
                .ProjectTo<CommentDto>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken: cancellationToken);

            /* возвращаем результат */
            return Result<List<CommentDto>>.Success(comments);
        }
    }
}