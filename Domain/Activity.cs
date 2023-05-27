using System.Security.AccessControl;

namespace Domain;

/// <summary>
/// Класс Активности,
/// наша доменная сущность
/// </summary>
public class Activity
{
    /// <summary>
    /// Индивидуальный идентификатор
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Название
    /// </summary>
    public string Title { get; set; }

    /// <summary>
    /// Дата
    /// </summary>
    public DateTime Date { get; set; }

    /// <summary>
    /// Описание
    /// </summary>
    public string Description { get; set; }
    
    /// <summary>
    /// Категория
    /// </summary>
    public string Category { get; set; }
    
    /// <summary>
    /// Город
    /// </summary>
    public string City { get; set; }
    
    /// <summary>
    /// Место проведения
    /// </summary>
    public string Venue { get; set; }
}
