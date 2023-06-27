using AutoMapper;
using Domain;
using Application.Activities;

namespace Application.Core;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        /* Сопоставляем свойства двух обьектов  */
        CreateMap<Activity, Activity>();
        CreateMap<Activity, ActivityDto>()
            /* прокидываем хоста в ActivityDto.HostUserName */
            .ForMember(d => d.HostUserName,
                o => o.MapFrom(s =>
                    s.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName));
           
        /* маппим Profile.Attendees и ActivityAttendee.Attendees */
        CreateMap<ActivityAttendee, Profiles.Profile>()
            
            .ForMember(p => p.DisplayName, o => 
                o.MapFrom(s => s.AppUser.DisplayName))
            
            .ForMember(p => p.UserName, o =>
                o.MapFrom(s => s.AppUser.UserName))
            
            .ForMember(p => p.Bio, o =>
                o.MapFrom(s => s.AppUser.Bio));
    }
}