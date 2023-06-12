using Application.Activities;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application;

/* Класс создания сущности (Activity) */
public class Create
{
    /* Комманды ничего не возвращают(только изменяют данные)*/
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

    /* Обработчик команды*/
    public class Handler : IRequestHandler<Command>
    {
        private readonly DataContext _context;
        private readonly ILogger<Create> _logger;

        public Handler(DataContext _context, ILogger<Create> _logger)
        {
            this._context = _context;
            this._logger = _logger;
        }

        /// <summary>
        /// Метод выполняет команду
        /// </summary>
        /// <param name="request">Команда</param>
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

            /* Не используем AddAsync(), так как мы не подключаемся к базе данных, отсюда мы лишь
               добавляем новый обьект в память */
            _context.Activities.Add(request.Activity);

            await _context.SaveChangesAsync();

            return Unit.Value;
        }
    }

}