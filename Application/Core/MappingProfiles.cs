using AutoMapper;
using Domain;
using Application.Activities;
using Application.Comments;

namespace Application.Core;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        string currentUserName = null;
        
        /* Сопоставляем свойства двух обьектов  */
        CreateMap<Activity, Activity>();
        CreateMap<Activity, ActivityDto>()
            /* прокидываем хоста в ActivityDto.HostUserName */
            .ForMember(d => d.HostUserName, o => o.MapFrom(s => s.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName));
        
        /* маппим ActivityAttendee.Attendees и AttandeeDto */
        CreateMap<ActivityAttendee, AttandeeDto>()
            .ForMember(d => d.DisplayName, o => o.MapFrom(a => a.AppUser.DisplayName))
            .ForMember(d => d.UserName, o => o.MapFrom(a => a.AppUser.UserName))
            .ForMember(d => d.Bio, o => o.MapFrom(a => a.AppUser.Bio))
            .ForMember(d => d.Image, o => o.MapFrom(a => a.AppUser.Photos.FirstOrDefault(p => p.IsMain).Url))
            .ForMember(d => d.FollowersCount, o => o.MapFrom(u => u.AppUser.Followers.Count))
            .ForMember(d => d.FollowingCount, o => o.MapFrom(u => u.AppUser.Followings.Count))
            .ForMember(d => d.Following, o => o.MapFrom(u => u.AppUser.Followers.Any(x => x.Observer.UserName == currentUserName)));


        /* маппим фото из AppUser в Profile */
        CreateMap<AppUser, Profiles.Profile>()
            .ForMember(p => p.Image, o => o.MapFrom(a => a.Photos.FirstOrDefault(p => p.IsMain).Url))
            .ForMember(d => d.FollowersCount, o => o.MapFrom(u => u.Followers.Count))
            .ForMember(d => d.FollowingCount, o => o.MapFrom(u => u.Followings.Count))
            .ForMember(d => d.Following, o => o.MapFrom(u => u.Followers.Any(x => x.Observer.UserName == currentUserName)));

        CreateMap<Comment, CommentDto>()
            .ForMember(d => d.DisplayName, o => o.MapFrom(a => a.Author.DisplayName))            
            .ForMember(d => d.UserName, o => o.MapFrom(a => a.Author.UserName))
            .ForMember(d => d.Body, o => o.MapFrom(a => a.Body))
            .ForMember(d => d.Image, o => o.MapFrom(a => a.Author.Photos.FirstOrDefault(p => p.IsMain).Url));

        CreateMap<ActivityAttendee, Profiles.UserActivityDto>()
            .ForMember(d => d.Id, o => o.MapFrom(a => a.Activity.Id))
            .ForMember(d => d.Date, o => o.MapFrom(a => a.Activity.Date))
            .ForMember(d => d.Category, o => o.MapFrom(a => a.Activity.Category))
            .ForMember(d => d.HostUserName,
                o => o.MapFrom(a => a.Activity.Attendees.FirstOrDefault(a => a.IsHost).AppUser.UserName))
            .ForMember(d => d.Title, o => o.MapFrom(a => a.Activity.Title));
    }
}