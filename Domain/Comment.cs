namespace Domain;

public class Comment
{
    public string Id { get; set; }
    public string Body { get; set; }
    public AppUser Author { get; set; }
    public Activity Activity { get; set; }
    public DateTime CreateAt { get; set; } = DateTime.UtcNow;
}