using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BaseApiController : ControllerBase
{
    private IMediator _mediator;
    
    /* Тут мы просто получаем нас серивис IMediator и делаем его доступым из свойства Mediator
     для класов наследников*/    
    protected IMediator Mediator =>
        _mediator ??= HttpContext.RequestServices.GetService<IMediator>();

}
/* */