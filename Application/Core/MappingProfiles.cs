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
        
        /* маппим ActivityAttendee.Attendees и AttandeeDto */
        CreateMap<ActivityAttendee, AttandeeDto>()

            .ForMember(d => d.DisplayName, o =>
                o.MapFrom(a => a.AppUser.DisplayName))

            .ForMember(d => d.UserName, o =>
                o.MapFrom(a => a.AppUser.UserName))

            .ForMember(d => d.Bio, o =>
                o.MapFrom(a => a.AppUser.Bio))

            .ForMember(d => d.Image, o => o
                .MapFrom(a => a.AppUser.Photos.FirstOrDefault(p => p.IsMain).Url));
                
        
        /* маппим фото из AppUser в Profile */
        CreateMap<AppUser, Profiles.Profile>()
            .ForMember(p => p.Image, o => o
                .MapFrom(a => a.Photos.FirstOrDefault(p => p.IsMain).Url));
    }
}