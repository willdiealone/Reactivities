using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos;

public class SetMain
{
    public class Command : IRequest<Result<Unit>>
    {
        public string Id { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly IUserAccessor _userAccessor;
        private readonly DataContext _dataContext;

        public Handler(IUserAccessor userAccessor,DataContext dataContext)
        {
            _userAccessor = userAccessor;
            _dataContext = dataContext;
        }
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            /* получаем юзера с его фотографиями */
            var user = await _dataContext.Users.Include(u => u.Photos)
                .FirstOrDefaultAsync(a => a.UserName == _userAccessor.GetUserName());

            /* проверяем юзера */
            if (user == null) return null;
            
            /* получаем изображение юзера по айди */
            var photo = user.Photos.FirstOrDefault(p => p.Id == request.Id);

            /* проверяем фото */
            if (photo == null) return null;

            /* возвращаем главное изображение */
            var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);

            /* если по какой то причине есть главное фото, снимаем с него флаг */
            if (currentMain != null) currentMain.IsMain = false;

            /* делаем фото по id главным */
            photo.IsMain = true;

            var result = await _dataContext.SaveChangesAsync() > 0;
            
            /* возвращаем результат */
            return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem setting main photo");
        }
    }
}