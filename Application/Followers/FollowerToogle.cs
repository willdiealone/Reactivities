using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers;

public class FollowerToogle
{
    public class Command : IRequest<Result<Unit>>
    {
        public string TargetUserName { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;

        public Handler(DataContext context, IUserAccessor userAccessor )
        {
            _context = context;
            _userAccessor = userAccessor;
        }
        
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var observer = await _context.Users.FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUserName());

            if (observer == null) return null;

            var target = await _context.Users.FirstOrDefaultAsync(x => x.UserName == request.TargetUserName);

            if (target == null) return null;

            var following = await _context.UserFollowings.FindAsync(observer.Id, target.Id);

            if (following == null)
            {
                following = new UserFollowing()
                {
                    ObserverId = observer.Id,
                    Observer = observer,
                    TargetId = target.Id,
                    Target = target
                };

                _context.UserFollowings.Add(following);
                
            }
            else
            {
                _context.UserFollowings.Remove(following);
                
            }
            
            var result = await _context.SaveChangesAsync() > 0;

            return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failde to update to following");
            
        }
    }
}
