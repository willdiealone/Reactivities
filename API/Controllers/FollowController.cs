using Application.Followers;
using Microsoft.AspNetCore.Mvc;
using List = Application.Followers.List;

namespace API.Controllers;

public class FollowController : BaseApiController
{
    #region Post

    /// <summary>
    /// метод подписки и потписки
    /// </summary>
    /// <param name="userName"></param>
    /// <returns></returns>
    [HttpPost("{userName}")]
    public async Task<IActionResult> Follow(string userName)
    {
        return HandleResult(await Mediator.Send(new FollowerToogle.Command() { TargetUserName = userName }));
    }

    #endregion

    #region Get

    /// <summary>
    /// метод возвращает подписчиков или подписки
    /// в зависимости от пердиката
    /// </summary>
    /// <param name="userName">имя пользователя из запроса</param>
    /// <param name="predicate">подписчик или таргет</param>
    /// <returns></returns>
    [HttpGet("{userName}")]
    public async Task<IActionResult> GetFollowings(string userName, string predicate)
    {
        return HandleResult(await Mediator.Send(new List.Query {UserName = userName, Predicate = predicate}));
    }

    #endregion
}