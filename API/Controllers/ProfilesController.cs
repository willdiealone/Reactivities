using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ProfilesController : BaseApiController
{
    #region Get

    [HttpGet("{userName}")]
    public async Task<IActionResult> GetProfile(string userName)
    {
        return HandleResult(await Mediator.Send(new Details.Query { UserName = userName }));
    }

    [HttpGet("{userName}/activities")]
    public async Task<IActionResult> GetUserActivities(string username, string predicate)
    {
        return HandleResult(await Mediator.Send(new ListActivities.Query() { UserName = username, Predicate = predicate }));
    }

    #endregion

    #region Put

    [HttpPut]
    public async Task<IActionResult> EditProfile(Edit.Command command)
    {
        return HandleResult(await Mediator.Send(command));
    }

    #endregion
}