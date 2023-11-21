using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos;

public class Add
{
    public class Command : IRequest<Result<Photo>>
    {
        public IFormFile File { get; set; }
    }

    public class Handler : IRequestHandler<Command,Result<Photo>>
    {
        
        private readonly DataContext _context;
        private readonly IPhotoAccessor _photoAccessor;
        private readonly IUserAccessor _userAccessor;

        public Handler(DataContext context,IPhotoAccessor photoAccessor,IUserAccessor userAccessor)
        {
            _context = context;
            _photoAccessor = photoAccessor;
            _userAccessor = userAccessor;
        }
        
        public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
        {
            /* возвращаем юзера из базы с его изображениями */
            var user = await _context.Users.Include(p => p.Photos)
                .FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUserName());

            /* загружаем фото */
            var uploadPhotoResult = await _photoAccessor.AddPhoto(request.File);

            /* создаем обьект на основе полученного изображения  */
            var photo = new Photo()
            {
                Id = uploadPhotoResult.PublicId,
                Url = uploadPhotoResult.Url
            };

            /* проверяем изображения на главное изобр. */
            if (!user.Photos.Any(x => x.IsMain))
                photo.IsMain = true;
            
            user.Photos.Add(photo);

            var result = await _context.SaveChangesAsync() > 0;

            /* возвращаем результат */
            return result ? Result<Photo>.Success(photo) : Result<Photo>.Failure("Problem deleting photo");
        }
    }
}