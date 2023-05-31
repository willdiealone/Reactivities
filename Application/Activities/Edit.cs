using Domain;
using MediatR;
using Persistence;

namespace Application;

/* Класс редактирования сущности (Activity) */
public class Edit
{
    public class Command : IRequest
    {
        public Activity Activity { get; set; }
        
        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            
            public Handler(DataContext context)
            {
                _context = context;
            }
            
            /// <summary>
            /// Метод редактирует данные
            /// </summary>
            /// <param name="request">Сущьность которую мы получаем</param>
            /// <param name="cancellationToken">Токен отмены</param>
            /// <returns>специальным типом, который представляет отсутствие значения
            /// (аналогично void в синхронных методах), но сообщает нашему api, что можем
            /// давигаться дальше</returns>
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                /* Возвращаем результат метода FindAsync() по id */
                var activity = await _context.Activities.FindAsync(request.Activity.Id);
                
                /* Меняем Title у обьекта из бд если новый Title==null, то не меняем */
                activity.Title = request.Activity.Title ?? activity.Title;
                
                /* метод SaveChangesAsync() "знает", какие изменения нужно сохранить,
                 потому что контекст базы данных отслеживает все изменения,
                 внесенные в объекты, которые были получены из базы данных,
                 и автоматически генерирует SQL-запросы для выполнения этих изменений 
                 при вызове метода SaveChangesAsync()*/
                await _context.SaveChangesAsync();
                
                return Unit.Value;
            }
        }
    }
}