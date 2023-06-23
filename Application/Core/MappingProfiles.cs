using AutoMapper;
using Domain;

namespace Application.Core;

// ReSharper disable CommentTypo

/* Класс для Автомаппинга */
public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        /* Сопоставляем свойства двух обьектов одного типа */
        CreateMap<Activity, Activity>();
    }
}