using Application.Activities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ActivitiesController : BaseApiController
{
    #region Get
    
    [HttpGet]     
    public async Task<IActionResult> GetActivities([FromQuery] ActivityParams activityParams)
    {
       return HandlePaginationResult(await Mediator.Send(new List.Query {Params = activityParams })); 
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetActivity(Guid id, CancellationToken ct){        
       return HandleResult(await Mediator.Send(new Details.Query { Id = id }, ct));
    }
    
    // [HttpGet("/")]
    // public IActionResult GetRoot()
    // {
    //     return Ok("API is running.");
    // }

    #endregion
    
    #region Post

    
    [HttpPost]
    public async Task<IActionResult> CreateActivity(Activity activity, CancellationToken ct)
    {
        return HandleResult(await Mediator.Send(new Create.Command { Activity = activity }, ct));
    }

    [HttpPost("{id}/attend")]
    public async Task<IActionResult> Attend(Guid id)
    {
        return HandleResult(await Mediator.Send(new UpdateAttendance.Command() { Id = id }));
    }

    #endregion

    #region Put

    [Authorize(Policy = "IsActivityHost")]
    [HttpPut("{id}")]
    public async Task<IActionResult> EditActivityById(Guid id, Activity activity, CancellationToken ct)
    {
        activity.Id = id;
        return HandleResult(await Mediator.Send(new Edit.Command { Activity = activity }, ct));
    }

    #endregion

    #region Delete

    [Authorize(Policy = "IsActivityHost")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteActivityById(Guid id, CancellationToken ct)
    {
        return HandleResult(await Mediator.Send(new Delete.Command { Id = id }, ct));
    }

    #endregion
}