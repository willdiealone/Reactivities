import {makeAutoObservable, runInAction} from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/agent";
import {v4 as uuid} from "uuid";

export default class ActivityStore {
        
    activityRegistry = new Map<string,Activity>();                      
    selectedActivity: Activity | undefined = undefined;
    editMode: boolean = false;
    loading: boolean = false;
    loadingInitial: boolean = true;


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


    // Метод который делает асинхронный запрос,
    // форматирует дату и отправяет элементы в коллекцию activityRegistry
    loadingActivities = async () => {        
        try {            
            const activities = await agent.Activities.list();
            activities.forEach(activity => {
                 activity.date = activity.date.split('T')[0];
                 this.activityRegistry.set(activity.id,activity);
            })
        this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    // функция которая хранит состояние загрузки интерфейса
    setLoadingInitial = (state:boolean) => {
        this.loadingInitial = state;
    }

    // функция которая сохраняет в переменную элемент по id
    selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
    }

    // функция делает selectedActivity undefined
    canselSelectedAvtivity = () => {
        this.selectedActivity = undefined;
    }

    // функция которая проверяет если есть id то вызов функции selectActivity(id)
    // если нет, то canselSelectedAvtivity().
    openForm = (id?: string) => {
        id ? this.selectActivity(id) : this.canselSelectedAvtivity();
        this.editMode = true;
    }

    // функция которая закрывает форму редактирования флагом editMode = false
    closeForm = () => {
        this.editMode = false;
        
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
                if (this.selectedActivity?.id === id) this.canselSelectedAvtivity();             
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