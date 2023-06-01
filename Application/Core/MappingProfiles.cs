using AutoMapper;
using Domain;

namespace Application.Core;


/* Класс для Автомаппинга */
public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        /* Сопоставляем свойства двух обьектов одного типа */
        CreateMap<Activity, Activity>();
    }
}