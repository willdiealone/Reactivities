using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos;

public class Delete 
{
    public class Command : IRequest<Result<Unit>>
    {
        public string Id { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly DataContext _context;
        private readonly IPhotoAccessor _photoAccessor;
        private readonly IUserAccessor _userAccessor;

        public Handler(DataContext context, IPhotoAccessor photoAccessor,IUserAccessor userAccessor)
        {
            _context = context;
            _photoAccessor = photoAccessor;
            _userAccessor = userAccessor;
        }
        
        /// <summary>
        /// метод удаялет изображение из облака и из базы 
        /// </summary>
        /// <param name="request">идентификатор изображения</param>
        /// <param name="cancellationToken">токен отмены</param>
        /// <returns>результат</returns>
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            /* берем юзера из базы с его изображениями */
            var user = await _context.Users.Include(p => p.Photos)
                .FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUserName());

            /* поверяем на null*/
            if (user == null) return null;

            var photo = user.Photos.FirstOrDefault(x => x.Id == request.Id);

            /* поверяем на null*/
            if (photo == null) return null;

            if (photo.IsMain) 
                return Result<Unit>.Failure("You can not delete your main photo");

            /* удаляем фото из облака */
            var result = _photoAccessor.DeletePhoto(photo.Id);

            /* проверяем результат */
            if (result == null) return Result<Unit>.Failure("Problem deleting photo fro Cloudinary");

            /* удаляем фото из колекции */
            user.Photos.Remove(photo);

            /* сохраняем изменения в базе данных */
            var success = await _context.SaveChangesAsync() > 0;

            /* возвращаем результат */
            return success ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem deleting photo");
        }
    }
}