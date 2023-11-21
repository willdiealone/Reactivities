using Application.Photos;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces;

public interface IPhotoAccessor
{
    /* загрузка фото */
    public Task<PhotoUploadResult> AddPhoto(IFormFile formFile);
    
    /* удаление фото */
    public Task<string> DeletePhoto(string publicId);

}