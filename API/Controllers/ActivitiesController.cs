using Application;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace API.Controllers;

[AllowAnonymous]
public class ActivitiesController : BaseApiController
{
    #region Get
    
    [HttpGet] 
    public async Task<IActionResult> GetActivities(CancellationToken ct)
    {
       return HandleResult(await Mediator.Send(new List.Query(), ct)); 
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetActivity(Guid id, CancellationToken ct){        
       return HandleResult(await Mediator.Send(new Details.Query() { Id = id }, ct));
    }

    
    [HttpGet("/")]
    public IActionResult GetRoot()
    {
        return Ok("API is running.");
    }

    #endregion

    #region Post

    
    [HttpPost]
    public async Task<IActionResult> CreateActivity(Activity activity, CancellationToken ct)
    {
        return HandleResult(await Mediator.Send(new Create.Command { Activity = activity }, ct));
    }

    #endregion

    #region Put

    
    [HttpPut("{id}")]
    public async Task<IActionResult> EditActivityById(Guid id, Activity activity, CancellationToken ct)
    {
        activity.Id = id;
        return HandleResult(await Mediator.Send(new Edit.Command { Activity = activity }, ct));
    }

    #endregion

    #region Delete

    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteActivityById(Guid id, CancellationToken ct)
    {
        return HandleResult(await Mediator.Send(new Delete.Command { Id = id }, ct));
    }

    #endregion
}