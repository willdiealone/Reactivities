import {ServerError} from "../models/serverError";
import {makeAutoObservable, reaction} from "mobx";

export default class CommonStore{
    error: ServerError | null = null; 
    token: string | null = localStorage.getItem('jwt'); 
    appLoaded= false;
    
    constructor() {
        makeAutoObservable(this);
        reaction(
            () => this.token,
            token =>{
                if(token){
                    localStorage.setItem('jwt',token);
                } else{
                    localStorage.removeItem('jwt');
                }
            }
        )
    }
    
    /* прокидываем ошибку */
    setServerError(error: ServerError){ this.error = error; }
    
    /* прокидываем токен  */ 
    setToken = (token: string | null) => { this.token = token;}
    
    /* прокидываем флаг, что приложение загружено */
    setAppLoaded = () => { this.appLoaded = true; }
}