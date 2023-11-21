using Application.Core;

namespace Application.Activities
{
    public class ActivityParams : PagingParams
    {
        public bool IsHost { get; set; }
        public bool IsGoing { get; set; }
        public DateTime StartDate { get; set; } = DateTime.UtcNow;
    }
}