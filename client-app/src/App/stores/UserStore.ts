import {User, UserFormValues} from "../../features/users/User";
import {makeAutoObservable, runInAction} from "mobx";
import agent from "../api/agent";
import {toast} from "react-toastify";
import error = toast.error;
import {store} from "./Store";
import {router} from "../router/Router";

export default class UserStore{
    user: User | null = null;
    
    constructor() {
        makeAutoObservable(this);
    }
    
    /* метод который вернет true или false если пользователь аутентифицирован*/
    get isLoggedIn(){
        return !!this.user;
    }
    
    /* метод который отправляет запроз для аутентификации */
    login = async (creds: UserFormValues)=> {
        try {
            const user = await agent.Account.login(creds);
            store.commonStore.setToken(user.token);
            runInAction(() => this.user = user);
            router.navigate('/activities');
            store.modalStore.closeModal();
        }catch (e) {
            throw error;
        }
    }
    
    /* метод регистрации */
    register = async (creds: UserFormValues)=> {
        try {
            const user = await agent.Account.register(creds);
            store.commonStore.setToken(user.token);
            runInAction(() => this.user = user);
            router.navigate('/activities');
            store.modalStore.closeModal();
        }catch (e) {
            throw error;
        }
    }

    /* метод токен = null (выходи их стистемы) */
    logOut = () => {
        store.commonStore.token = null;
        this.user = null;
        router.navigate('/');
    }
    
    getUser = async () =>{
        try {
            const user = await agent.Account.current();
            runInAction(()=> this.user = user)
        }catch (e) {
            console.log(e)
        }
    }
    
    setImage = async (image: string) => {
        if(this.user) this.user.image = image;
    }

    setDisplayName = (name:string) => {
        if (this.user) this.user.displayName = name ?? this.user.displayName; 
    }
    
}