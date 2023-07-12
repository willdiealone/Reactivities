using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ProfilesController : BaseApiController
{
    [HttpGet("{userName}")]
    public async Task<IActionResult> GetProfile(string userName)
    {
        return HandleResult(await Mediator.Send(new Details.Query { UserName = userName }));
    }

    [HttpPut]
    public async Task<IActionResult> EditProfile(Edit.Command command)
    {
        return HandleResult(await Mediator.Send(command));
    }
}