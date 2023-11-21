
namespace Application.Core;

public class PagingParams
{
    public int PageNumber { get; set; } = 1;

    private int MaxPageSize { get; init; } = 50;

    private int _pageSize = 10;

    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value > MaxPageSize ? MaxPageSize : value;
    }
}
