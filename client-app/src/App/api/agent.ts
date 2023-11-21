import axios, {AxiosError, AxiosResponse} from "axios";
import {Activity, ActivityFormValues} from "../models/activity";
import {toast} from "react-toastify";
import {router} from "../router/Router";
import {store} from "../stores/Store";
import {User, UserFormValues} from "../../features/users/User";
import {Photo, Profile, UserActivity} from "../models/profile";
import {PaginationResult} from "../models/pagination";


// создаем константу которая реализует задержку 
const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
};

// задаем базовый урл
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

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
    if(process.env.NODE_ENV === 'development'){
        await sleep(1000);   
    }
    const pagination = response.headers['pagination'];
    if(pagination){
        response.data = new PaginationResult(response.data,JSON.parse(pagination));
        return response as AxiosResponse<PaginationResult<any>>;
    }
    return response
    
}, (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse;
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
    list: (params: URLSearchParams) => axios.get<PaginationResult<Activity[]> >('Activities',{params: params})
        .then(responseBody),
    details: (id:string) => request.get<Activity>(`Activities/${id}`),
    create: (activity: ActivityFormValues) => request.post<void>('Activities', activity),
    update: (activity:ActivityFormValues) => request.put<void>(`activities/${activity.id}`,activity),
    delete: (id:string) => request.delete<void>(`activities/${id}`),
    attend: (id:string) => request.post<void>(`Activities/${id}/attend`,{}),
};

/* запрос для возврата нашего пользователя */
const Account ={
    current: () => request.get<User>('account'),
    login: (user:UserFormValues) => request.post<User>('account/login',user),
    register: (user:UserFormValues) => request.post<User>('account/register',user)
}

const Profiles = {
    get: (username:string) => request.get<Profile>(`/Profiles/${username}`),
    uploadPhoto: (file: Blob) => {
        let formData = new FormData();
        formData.append('File',file);
        return axios.post<Photo>('Photos',formData, {
            headers: {'Content-type': 'multipart/form-data'}
        })
    },
    setMainPhoto: (id: string) => request.post(`/Photos/${id}/setMain`,{}),
    deletePhoto: (id: string) => request.delete(`/Photos/${id}`),
    updateProfile: (profile: Partial<Profile>) => request.put('/Profiles', profile),
    updateFollowing: (username: string) => request.post(`/Follow/${username}`,{}),
    listFolowings: (username: string,predicate: string) => request.get<Profile[]>(`/Follow/${username}?predicate=${predicate}`),
    listActivities: (username: string,predicate: string) => 
        request.get<UserActivity[]>(`/Profiles/${username}/activities?predicate=${predicate}`) 
}

/* Agents для экспорта кода из этого файла */
const agent = {
    Activities,
    Account,
    Profiles
}

export default agent;