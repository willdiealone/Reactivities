using Application.Photos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class PhotosController : BaseApiController
{
    #region Post

    [HttpPost]
    public async Task<IActionResult> Add([FromForm] Add.Command command)
    {
        return HandleResult(await Mediator.Send(command));
    }
    
    [HttpPost("{id}/setMain")]
    public async Task<IActionResult> SetMain(string id)
    {
        return HandleResult(await Mediator.Send(new SetMain.Command { Id = id }));
    }
    
    #endregion

    #region Delete

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
    }

    #endregion
}