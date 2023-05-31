using Application;
using Domain;
using Microsoft.AspNetCore.Mvc;


namespace API.Controllers;

public class ActivitiesController : BaseApiController
{
    #region Get

    /// <summary>
    /// Метод получаем данные из Бд
    /// </summary>
    /// <returns>Возвращаем коллекцию данных из Бд</returns>
    [HttpGet] // api/activities
    public async Task<ActionResult<List<Activity>>> GetActivities()
    {
        return await Mediator.Send(new List.Query());
    }

    /// <summary>
    /// Метод возвращает данные по айди 
    /// </summary>
    /// <param name="id">Конкретный айди</param>
    /// <returns>Данные по указанному id</returns>
    [HttpGet("{id}")] // api/activities/id
    public async Task<ActionResult<Activity>> GetActivity(Guid id)
    {
        return await Mediator.Send(new Details.Query() {Id = id});
    }
    
    /// <summary>
    /// Обработчик корневого маршрута
    /// </summary>
    /// <returns>Результат что все в порядке</returns>
    [HttpGet("/")]
    public IActionResult GetRoot()
    {
        return Ok("API is running.");
    }
    
    #endregion

    #region Post

    /// <summary>
    /// Метод создает сущность
    /// </summary>
    /// <param name="activity">Обьект Активности</param>
    /// <returns>Возвращает резульать выполнения команды</returns>
    [HttpPost]
    public async Task<ActionResult> CreateActivity(Activity activity)
    {
        return Ok(await Mediator.Send(new Create.Command() {Activity = activity}));
    }

    #endregion

    #region Put

    /// <summary>
    /// Метод редактирует данные
    /// </summary>
    /// <param name="id">полученный id</param>
    /// <param name="activity">полученный activity</param>
    /// <returns>Возвращаем результат работы контроллера</returns>
    [HttpPut("{id}")]
    public async Task<ActionResult> EditActivityById(Guid id,Activity activity)
    {
        /* Устанавливаем id в пришедкий обьект activity и передаем его нашему обработчику */
        activity.Id = id;
        return Ok(await Mediator.Send(new Edit.Command() { Activity = activity }));
    }

    #endregion
}