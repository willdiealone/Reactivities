export interface Pagination{
    currentPage: number
    pageSize: number
    totalItems: number
    totalPages: number 
}

export class PaginationResult<T>{
    data: T;
    pagination: Pagination;
    
    constructor(data: T, pagination: Pagination) {
        this.data = data;
        this.pagination = pagination;
    }
}

export class PagingParams{
    pageNumber: number;
    pageSize: number;
    
    constructor(pageNumber = 1,pageSize  = 2 ) {
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
    }
}