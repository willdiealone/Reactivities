namespace Domain;

public class UserFollowing
{
    // id подписчика
    public string ObserverId { get; set; }
    
    // подписчик
    public AppUser Observer { get; set; }

    // id таргета
    public string TargetId { get; set; }
    
    // таргет
    public AppUser Target { get; set; }
}