using Application.Interfaces;
using Application.Photos;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace infrastructure.Photos;

public class PhotoAccessor : IPhotoAccessor
{
    private readonly Cloudinary _cloudinary;

    public PhotoAccessor(IOptions<CloudinarySettings> config)
    {
        /* передаем значения полей из файла настроек приложеия для создания обьекта Account*/
        var account = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
        );
        _cloudinary = new Cloudinary(account);
    }
    
    /// <summary>
    /// метод загружает изображение из клиента в облако
    /// </summary>
    /// <param name="file">файл, загруженный клиентом на сервер</param>
    /// <returns>PhotoUploadResult</returns>
    /// <exception cref="Exception">uploadResult.Error</exception>
    public async Task<PhotoUploadResult> AddPhoto(IFormFile file)
    {
        if (file.Length > 0)
        {
            /* открываем поток чтения */
            await using var stream = file.OpenReadStream();
            
            /* создаем обьект параметров загрузки */
            var uploadParams = new ImageUploadParams()
            {
                /* передаем имя файла и поток данных */
                File = new FileDescription(file.Name, stream),
                /* преобразование изображения */
                Transformation = new Transformation().Height(500).Width(500).Crop("fill")
            };
            
            /* загрузка изображения с прередачей(обьекта параметров загруки) */
            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            /* проверка на ошибку */
            if (uploadResult.Error != null) throw new Exception(uploadResult.Error.Message);

            /* создаем обьект для возврата, инициализируем его свойства из экземпляра загрузки */
            return new PhotoUploadResult()
            {
                PublicId = uploadResult.PublicId,
                Url = uploadResult.SecureUrl.ToString()
            };
        }

        return null;
    }

    /// <summary>
    /// метод удаляет изображение ассинхронно
    /// </summary>
    /// <param name="publicId"></param>
    /// <returns>DeletionResult</returns>
    public async Task<string> DeletePhoto(string publicId)
    {
        /* передаем id в обьект удаления */
        var deleteParams = new DeletionParams(publicId);
        
        /* выполнение операции удаления */
        var result = await _cloudinary.DestroyAsync(deleteParams);

        /* если все четко то возвращаем result, если нет то null */
        return result.Result == "ok" ? result.Result : null;
    }
}