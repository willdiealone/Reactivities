using System.Formats.Asn1;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application;

/* Класс который делает общий запрос */
public class List
{
    /* Класс Query является запросом, реализует интерфейс IRequest который возвращает список активностей.
       В контексте интерфейса IRequest параметризированный тип <List<Activity>> указывает на то, что мы запаршиваем */
    public class Query : IRequest<List<Activity>>{}

    /*Это обработчик запроса Query, который будет выполняться при поступлении запроса типа Query
      и будет возвращать список активностей. Так как наш запрос будет к данным из бд,
      то мы должны внедрить через конструктор контекст данных*/
    public class Handler : IRequestHandler<Query, List<Activity>>
    {
        private readonly DataContext _context;
        private readonly ILogger<List> _logger;

        public Handler(DataContext context,ILogger<List> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Обработчик запроса 
        /// </summary>
        /// <param name="request">Сам Запрос</param>
        /// <param name="cancellationToken">Токен отмены</param>
        /// <returns>Список активностей</returns>
        public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
        {
            try
            {
                if (cancellationToken.IsCancellationRequested)
                {
                    cancellationToken.ThrowIfCancellationRequested();
                }
            }
            catch (Exception)
            {
                _logger.LogInformation("Task was canseled");
            }
            
            // ожидает возврат списка активнностей
            return await _context.Activities.ToListAsync();
        }
    }
}