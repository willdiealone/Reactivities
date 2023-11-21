
namespace Application.Core
{
    public class AppException 
    {
        public int StatusCode { get; set; }
        public string Message { get; set; }
        public string Details { get; set; }
        
        public AppException(int StatusCode,string Message,string Details = null)
        {
            this.StatusCode = StatusCode;
            this.Details = Details;
            this.Message = Message;
        } 
    }
}