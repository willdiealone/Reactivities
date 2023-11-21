using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Serilog;
using Create = Application.Comments.Create;

namespace API.SignalR;

public class ChatHub : Hub
{
    private readonly IMediator _mediator;

    public ChatHub(IMediator mediator)
    {
        _mediator = mediator;
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
        /* получаем контекст данных запроса */
        var httpContext = Context.GetHttpContext();

        var activityId = httpContext!.Request.Query["activityId"];

        await Groups.AddToGroupAsync(Context.ConnectionId, activityId);

        var result = await _mediator.Send(new List.Query { ActivityId = Guid.Parse(activityId) });

         if (result != null){
            Log.Information("responce comment => {@comment}" , result);
        }
        if (result == null){
            Log.Information("responce comment => null");
        }


        await Clients.Caller.SendAsync("LoadComments", result.Value);
    }
}