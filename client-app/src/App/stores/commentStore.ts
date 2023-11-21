import { ChatComment } from "../models/comment";
import { HubConnection, HubConnectionBuilder, LogLevel, ILogger } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import { store } from "./Store";


export default class CommentStore {
    comments: ChatComment[] = []
    hubConnection: HubConnection | null = null

    constructor() {
        makeAutoObservable(this)
    }

    /* подключение и конфигурация */
    createHubConnections = (activityId: string) => {
        if (store.activityStore.selectedActivity) {

            /* создается новый объект HubConnection */
            this.hubConnection = new HubConnectionBuilder()

                /* предаем путь к хабу */
                .withUrl(process.env.REACT_APP_CHAT_URL +`?activityId=${activityId}`, {

                    /* передаем токен юзера */
                    accessTokenFactory: () => store.userStore.user?.token!

                })

                /* автоматическое переподключение в случае ра`зрыва соединения */
                .withAutomaticReconnect()

                /* будут записываться сообщения информационного уровня и более высокого уровня */
                .configureLogging(LogLevel.Error)

                /* метод завершает конфигурацию объекта HubConnection и создает фактическое соединение */
                .build();

            /* метод start() для установки соединения с хабом */
            this.hubConnection
                .start()
                .then(() => {
                    console.log("Connection started");
                })
                .catch((error) => {
                    console.log("Error establishing the connection: ", error);
                });

            /* Когда на сервере происходит событие 'LoadComments', переданный обработчик будет вызываться 
            *  когда событие 'LoadComments' происходит, массив комментариев comments будет обновлен */
            this.hubConnection.on('LoadComments', (comments: ChatComment[]) => {
                runInAction(() => {            
                    comments.forEach(comment => {                        
                        comment.createAt = new Date(comment.createAt);
                    })
                    this.comments = comments;
                });
            });


            /* когда событие 'ReseveComment' происходит, новый комментарий comment будет добавлен в массив комментариев */
            this.hubConnection.on('ReseveComment', (comment: ChatComment) => {
                runInAction(() => {
                    comment.createAt = new Date(comment.createAt);                    
                    this.comments.unshift(comment);            
                })
            })
        }
    }

    /* остановка соединения с хабом */
    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error => console.log('Error spoping connetcion: ', error))
    }

    /* очистка массива комментариев и остановка соединения с хабом */
    clearComments = () => {
        this.comments = [];
        this.stopHubConnection();
    }

    addComment = async (values: any) => {
        values.activityId = store.activityStore.selectedActivity?.id
        try {
            await this.hubConnection?.invoke("SendComment", values)
            runInAction(() => {
                console.log(values)
            })
        } catch (error) {
            console.log(error)
        }
    }
}