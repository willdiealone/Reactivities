using Application.Activities;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application;

/* Класс редактирования сущности (Activity) */
public class Edit
{
    public class Command : IRequest
    {
        public Activity Activity { get; set; }

    }

     public class CommandValidator : AbstractValidator<Command>{
        public CommandValidator()
        {
            RuleFor( x => x.Activity).SetValidator(new ActivityValidator());
        }
    }


    public class Handler : IRequestHandler<Command>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<Edit> _logger;

        public Handler(DataContext context, IMapper mapper, ILogger<Edit> _logger)
        {
            _context = context;
            _mapper = mapper;
            this._logger = _logger;
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

            // Приводим дату к UTC
            if (request.Activity.Date.Kind != DateTimeKind.Utc)
            {
                request.Activity.Date = DateTime.SpecifyKind(request.Activity.Date, DateTimeKind.Utc);
            }

            /* Возвращаем результат метода FindAsync() по id */
            var activity = await _context.Activities.FindAsync(request.Activity.Id);

            /* Используем autoMapper(сопоставляем свойства обьекта из запроса с обьектом из нашей бд) */
            _mapper.Map(request.Activity, activity);

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