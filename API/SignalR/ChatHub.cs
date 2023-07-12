using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Create = Application.Comments.Create;

namespace API.SignalR;

public class ChatHub : Hub
{
    private readonly IMediator _mediator;
    private readonly ILogger<ChatHub> _logger;

    public ChatHub(IMediator mediator, ILogger<ChatHub> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// метод отправялет сообщение всем участникам группы(ActivityId)
    /// </summary>
    /// <param name="command"></param>
    public async Task SendComment(Create.Command command)
    {
        /* отдаем полученный комментарий обработчику */
        var comment = await _mediator.Send(command);

        await Clients.Group(command.ActivityId.ToString())
            .SendAsync("ReseveComment", comment.Value);
    }

    /// <summary>
    /// метод подключения к SignalR
    /// устанавливаем идентификатор подключения
    /// и возвращаем список комментариев подключившемуся пользователю
    /// </summary>
    public async override Task OnConnectedAsync()
    {
        try
        {
            /* получаем контекст данных запроса */
            var httpContext = Context.GetHttpContext();

            var activityId = httpContext!.Request.Query["activityId"];

            await Groups.AddToGroupAsync(Context.ConnectionId, activityId);

            var result = await _mediator.Send(new List.Query { ActivityId = Guid.Parse(activityId) });

            await Clients.Caller.SendAsync("LoadComments", result.Value);

        }
        catch (Exception e)
        {
            _logger.LogInformation(e, "Error");
        }
    }
}