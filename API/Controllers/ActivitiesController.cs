
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers;

[ApiController]
[Route("/[controller]")]
public class ActivitiesController : ControllerBase
{
    private readonly DataContext _dataContext;
    
    public ActivitiesController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    /// <summary>
    /// Метод получаем данные из Бд
    /// </summary>
    /// <returns>Возвращаем коллекцию данных из Бд</returns>
    [HttpGet] // api/activities
    public async Task<ActionResult<List<Activity>>> GetActivities()
    {
        return await _dataContext.Activities.ToListAsync();
    }


    /// <summary>
    /// Метод возвращает данные по айди 
    /// </summary>
    /// <param name="id">Конкретный айди</param>
    /// <returns>Данные по указанному id</returns>
    [HttpGet("{id}")] // api/activities/id
    public async Task<ActionResult<Activity>> GetActivity(Guid id)
    {
        return await _dataContext.Activities.FindAsync(id);
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
}