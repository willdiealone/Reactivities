import axios, {AxiosError, AxiosResponse} from "axios";
import {Activity} from "../models/activity";
import {toast} from "react-toastify";
import {router} from "../router/Router";
import {store} from "../stores/Store";



// задаем базовый урл
axios.defaults.baseURL = 'http://localhost:5434/api/';

// инициализируем responseBody данными которые получаем в ответе на http запрос
const responseBody = <T> (response: AxiosResponse<T>) => response.data;

// создаем константу которая реализует задержку 
const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
};


/* вызываем задержку после получения ответа или проверяем error на статус код */ 
axios.interceptors.response.use(async response => {
    
    await sleep(1000);
    return response
    
}, (error: AxiosError) => {
    const {data, status, config} = error.response as AxiosResponse;
    switch (status) {
        /* не верный запрос */
        case 400: 
            // if(config.method === 'get' && data.errors.hasOwnProperty('id')){
            //     router.navigate('/not-found');
            // }
            if(config.url?.includes('activities/notaguid')){
                router.navigate('/not-found')
            }
            if (config.url?.includes('buggy/bad-request')){
                toast.error(data);
            }
            if(data.errors){
                const modalStateErrors = [];
                for (const key in data.errors){
                    if(data.errors[key]){
                        modalStateErrors.push(data.errors[key]);
                    }
                }
                throw modalStateErrors.flat();
            }
            break;
        case 401: toast.error('unauthorised') /* ошибка аутентификации */ 
            break;
        case 403: toast.error('forbidden') /* ошибка авторизации */ 
            break;
        case 404: router.navigate('/not-found') /* не найдено */
            break;
        case 500: store.commonStore.setServerError(data); 
            router.navigate('/server-error')  /* ошика сервера */
            break;
        default: 
            break;
    }
    return Promise.reject(error);
});

// константа которая имеет методы crud и передает данные в responseBody
// url:string => путь запроса 
// body: {} => (тело) обьект для изменения данных или создания данных
const response =  {
    
    get: <T> (url:string) => axios.get<T>(url).then(responseBody),
    post: <T> (url:string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T> (url:string, body: {}) => axios.put<T>(url, body).then(responseBody),
    delete: <T> (url:string) => axios.delete<T>(url).then(responseBody),
}

/* обьект который хранит в себе методы */
const Activities ={
    list: () => response.get<Activity[]>('Activities'),
    details: (id:string) => response.get<Activity>(`Activities/${id}`),
    create: (activity: Activity) => response.post<void>('Activities', activity),
    update: (activity:Activity) => response.put<void>(`activities/${activity.id}`,activity),
    delete: (id:string) => response.delete<void>(`activities/${id}`),
};

/* Agents для экспорта кода из этого файла */
const agent = {
    Activities
}

export default agent;