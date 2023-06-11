import {makeAutoObservable, runInAction} from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/agent";
import {v4 as uuid} from "uuid";

export default class ActivityStore {
        
    activityRegistry = new Map<string,Activity>();                      
    selectedActivity: Activity | undefined = undefined;
    editMode: boolean = false;
    loading: boolean = false;
    loadingInitial: boolean = false;


    // конструктор класса в котором мы устанавливаем
    // все обьекты наблюдаемые 
    constructor() {
        makeAutoObservable(this)
    }

   // функция сортирует нашу коллекцию по дате
   get acitivityByDate(){
    return Array.from(this.activityRegistry.values()).sort((a,b) => 
        Date.parse(a.date) - Date.parse(b.date));
   }


    // функция которая делает асинхронный запрос,
    // форматирует дату и отправяет элементы в коллекцию activityRegistry
    loadingActivities = async () => {      
        this.setLoadingInitial(true);  
        try {            
            const activities = await agent.Activities.list();
            activities.forEach(activity => {
                this.setActivity(activity);
            })
        this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    // функция которая делает асинхронный запрос в бд
    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if(activity){
            this.selectedActivity = activity;
            return activity;
        }
        else{
            this.setLoadingInitial(true);
            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                this.selectedActivity = activity;
                this.setLoadingInitial(false);
                return activity;
            } catch (error) {
                console.log(error)
                this.setLoadingInitial(false);
            }
        }
    }

    // функиция которая изменяет дату обьекта и кладет его в коллекцию
    private setActivity = (activity: Activity) => {
        activity.date = activity.date.split('T')[0];
        this.activityRegistry.set(activity.id,activity);
    }

    // функция которая возвращает элемент коллекции по id
    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    // функция которая хранит состояние загрузки интерфейса
    setLoadingInitial = (state:boolean) => {
        this.loadingInitial = state;
    }     

    // создает обьект который пришел параметром, отправяет его в бд и добавляет в нашу коллекцию
    createActivity = async (activity: Activity) => {
        this.loading = true;
        activity.id = uuid();        
        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id,activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            }) 
        } catch (error) {
            console.log(error);
            this.loading = false;
        }
    }


    // функция добавляет новый обект по найденому ключу
    updateActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id,activity)
                this.selectedActivity = activity;             
                this.editMode = false;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
        }
    }

    // функция удаляет обьект из коллекции по id
    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);            
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }
    
}