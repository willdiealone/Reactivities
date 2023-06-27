

/* интерфейс нашего пользователя */
export interface User{
    userName: string,
    displayName:string,
    image?:string,
    token:string,
}

// интерфейс заполнения формы
export interface UserFormValues{
    email:string,
    password:string,
    displayName?:string,
    userName?:string
}