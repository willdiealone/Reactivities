using System.Text.Json;

namespace API.Extensions;

public static class HttpExtentions
{
    public static void AddPaginationHeader(this HttpResponse response, int currentPage, int itemsPerPage,
        int totalItems, int totalPages)
    {
        var paginationHeader = new
        {
            currentPage,
            itemsPerPage,
            totalItems,
            totalPages
        };

        response.Headers.Add("Pagination", JsonSerializer.Serialize(paginationHeader));

        /* Заголовок "Pagination" будет доступен для чтения клиентской стороной, поскольку также добавляется заголовок
         "Access-Control-Expose-Headers"с значением "Pagination". Это делается для того,
         чтобы клиентская сторона (обычно веб-приложение, работающее в браузере) имела доступ к этому заголовку в ответе,
         даже если сервер настроен на использование определенных заголовков для безопасности
         (CORS - Cross-Origin Resource Sharing).
         */
        response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
    }
}