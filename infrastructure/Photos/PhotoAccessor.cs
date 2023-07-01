using Application.Interfaces;
using Application.Photos;
using Microsoft.AspNetCore.Http;

namespace infrastructure.Photos;

public class PhotoAccessor : IPhotoAccessor
{
    public PhotoAccessor(IHttpContextAccessor httpContextAccessor)
    {
        
    }


    public Task<PhotoUploadResult> AddPhoto(IFormFile formFile)
    {
        throw new NotImplementedException();
    }

    public Task<string> DeletePhoto(string publicId)
    {
        throw new NotImplementedException();
    }
}