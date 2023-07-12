import {ChatComment} from "../models/comment";
import {HubConnection, HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import {makeAutoObservable, runInAction} from "mobx";
import {store} from "./Store";


export default class CommentStore{
    comments: ChatComment[] = []
    hubConnection: HubConnection | null = null
    
    constructor() {
        makeAutoObservable(this)
    }
    
    /* подключение и конфигурация */
    createHubConnections = (activityId: string) =>{
        if(store.activityStore.selectedActivity){
            console.log(activityId)
            
            /* создается новый объект HubConnection */
            this.hubConnection = new HubConnectionBuilder()
                
                /* предаем путь к хабу */
                .withUrl(`http://localhost:5434/chat?activityId=${activityId}`, {
                    
                    /* епредаем токен юзера */
                    accessTokenFactory: () => store.userStore.user?.token!
                })
                
                /* автоматическое переподключение в случае разрыва соединения */
                .withAutomaticReconnect()
                
                /* будут записываться сообщения информационного уровня и более высокого уровня */
                .configureLogging(LogLevel.Information)
                
                /* метод завершает конфигурацию объекта HubConnection и создает фактическое соединение */
                .build();

            console.log(activityId)
                
            /* метод start() для установки соединения с хабом */
            this.hubConnection.start().catch(error => console.log("'Error establishing the connection: ",error));
            
            /* Когда на сервере происходит событие 'LoadComments', переданный обработчик будет вызываться 
            *  когда событие 'LoadComments' происходит, массив комментариев comments будет обновлен */
            this.hubConnection.on('LoadComments', (comments: ChatComment[]) => {
                runInAction(()=>this.comments = comments)
            });

            /* когда событие 'ReseveComment' происходит, новый комментарий comment будет добавлен в массив комментариев */
            this.hubConnection.on('ReseveComment',(comment: ChatComment) => {
                runInAction(() => this.comments.push(comment))
            })
        }
    }
    
    /* остановка соединения с хабом */
    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error => console.log('Error spoping connetcion: ',error))
    }
    
    /* очистка массива комментариев и остановка соединения с хабом */
    clearComments = () => {
        this.comments = [];
        this.stopHubConnection();
    }
}