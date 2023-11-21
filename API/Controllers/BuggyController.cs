using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;
[AllowAnonymous]
public class BuggyController : BaseApiController
{

    #region Get
    
    [AllowAnonymous]
    [HttpGet("not-found")]
    public ActionResult GetNotFound()
    {
        return NotFound();
    }

    [AllowAnonymous]
    [HttpGet("bad-request")]
    public ActionResult GetBadRequest()
    {
        return BadRequest("This is a bad request");

    }


    [AllowAnonymous]
    [HttpGet("server-error")]
    public ActionResult GetServerError()
    {
        throw new Exception("This is a server error");

    }

    [AllowAnonymous]
    [HttpGet("unauthorised")]
    public ActionResult GetUnauthorised()
    {
        return Unauthorized();

    }
    
    #endregion

}
