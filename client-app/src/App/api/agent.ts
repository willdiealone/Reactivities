import axios, {AxiosResponse} from "axios";
import {Activity} from "../models/activity";


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


// вызываем задержку после и возвращаем данные
axios.interceptors.response.use(async response => {
    try {
        await sleep(1000);
        return response
    } catch (Error) {
        console.log(Error)
        return Promise.reject(Error)
    }
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

// обьект который хранит в себе методы
const Activities ={
    list: () => response.get<Activity[]>('Activities'),
    details: (id:string) => response.get<Activity>(`Activities/${id}`),
    create: (activity: Activity) => response.post<void>('Activities', activity),
    update: (activity:Activity) => response.put<void>(`activities/${activity.id}`,activity),
    delete: (id:string) => response.delete<void>(`activities/${id}`),
};

// Agents для экспорта кода из этого файла
const agent = {
    Activities
}

export default agent;