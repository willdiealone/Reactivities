import axios, {AxiosError, AxiosResponse} from "axios";
import {Activity} from "../models/activity";
import {toast} from "react-toastify";
import {router} from "../router/Router";
import {store} from "../stores/Store";
import {User, UserFormValues} from "../../features/users/User";


// создаем константу которая реализует задержку 
const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
};

// задаем базовый урл
axios.defaults.baseURL = 'http://localhost:5434/api/';

// инициализируем responseBody данными которые получаем в ответе на http запрос
const responseBody = <T> (response: AxiosResponse<T>) => response.data;

/* отправляем токен с запросом в заголовке */
axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if(token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

/* вызываем задержку после получения ответа или проверяем error на статус код */ 
axios.interceptors.response.use(async response => {
    
    await sleep(1000);
    return response
    
}, (error: AxiosError) => {
    const { data, status, config } = error.response as AxiosResponse;
    switch (status) {
        case 400:
            if (data.errors && Object.keys(data.errors).includes("Password")) {
                const passwordErrors = data.errors.Password;
                toast.error(passwordErrors[0]);
            }
            if (data.errors) {
                const modalStateErrors = [];
                console.log(data.errors);
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modalStateErrors.push(data.errors[key])
                    }
                }
                throw modalStateErrors.flat();
            } else {
                toast.error(data);
            }
            break;
        case 401:
            toast.error('unauthorised')
            break;
        case 403:
            toast.error('forbidden')
            break;
        case 404:
            router.navigate('/not-found');
            break;
        case 500:
            store.commonStore.setServerError(data);
            router.navigate('/server-error');
            break;
    }
    return Promise.reject(error);
})

// константа которая имеет методы crud и передает данные в responseBody
// url:string => путь запроса 
// body: {} => (тело) обьект для изменения данных или создания данных
const request =  {
    
    get: <T> (url:string) => axios.get<T>(url).then(responseBody),
    post: <T> (url:string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T> (url:string, body: {}) => axios.put<T>(url, body).then(responseBody),
    delete: <T> (url:string) => axios.delete<T>(url).then(responseBody),
}

/* обьект который хранит в себе методы */
const Activities ={
    list: () => request.get<Activity[]>('Activities'),
    details: (id:string) => request.get<Activity>(`Activities/${id}`),
    create: (activity: Activity) => request.post<void>('Activities', activity),
    update: (activity:Activity) => request.put<void>(`activities/${activity.id}`,activity),
    delete: (id:string) => request.delete<void>(`activities/${id}`),
};

/* запрос для возврата нашего пользователя */
const Account ={
    current: () => request.get<User>('account'),
    login: (user:UserFormValues) => request.post<User>('account/login',user),
    register: (user:UserFormValues) => request.post<User>('account/register',user)
}

/* Agents для экспорта кода из этого файла */
const agent = {
    Activities,
    Account
}

export default agent;

// (error: AxiosError) => {
//     const {data, status, config} = error.response as AxiosResponse;
//     switch (status) {
//         /* не верный запрос */
//         case 400:
//             if(config.method === 'get' && data.errors.hasOwnProperty('id')){
//                 router.navigate('/not-found');
//             }
//             // if (config.url?.includes('aсcount/register')){
//             //     toast.error(data);
//             // }
//             // if(config.url?.includes('activities/notaguid')){
//             //     toast.error(data);
//             //     router.navigate('/not-found')
//             // }
//             if (config.url?.includes('buggy/bad-request')){
//                 toast.error(data);
//             }
//             if(data.errors){
//                 const modalStateErrors = [];
//                 for (const key in data.errors){
//                     if(data.errors[key]){
//                         modalStateErrors.push(data.errors[key]);
//                     }
//                 }
//                 throw modalStateErrors.flat();
//             }
//             break;
//         case 401: toast.error('unauthorised') /* ошибка аутентификации */
//             break;
//         case 403: toast.error('forbidden') /* ошибка авторизации */
//             break;
//         case 404: router.navigate('/not-found') /* не найдено */
//             break;
//         case 500: store.commonStore.setServerError(data);
//             router.navigate('/server-error')  /* ошика сервера */
//             break;
//         default:
//             break;
//     }
//     return Promise.reject(error);
// });