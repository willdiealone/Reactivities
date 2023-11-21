import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Activity, ActivityFormValues } from "../models/activity";
import agent from "../api/agent";
import { v4 as uuid } from "uuid";
import { format } from "date-fns";
import { store } from "./Store";
import { Profile } from "../models/profile";
import { Pagination, PagingParams } from "../models/pagination";

export default class ActivityStore {

    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    loading: boolean = false;
    loadingInitial: boolean = false;
    pagination: Pagination | null = null;
    pagingParams = new PagingParams();
    predicate = new Map().set('all', true);


    // конструктор класса в котором мы устанавливаем
    // все обьекты наблюдаемые 
    // отслеживаем predicate    
    constructor() {
        makeAutoObservable(this);
        reaction(
            () => this.predicate.keys(),
            () => {
                this.pagingParams = new PagingParams();
                this.activityRegistry.clear();
                this.loadingActivities();
            }
        )
    }

    // функция сортирует нашу коллекцию по дате
    get acitivityByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) =>
            a.date!.getTime() - b.date!.getTime());
    }

    // создаем исчисляемое свойство для передачи параметров пагинации
    get axiosParams() {
        const params = new URLSearchParams;
        params.append('pageNumber', this.pagingParams.pageNumber.toString());
        params.append('pageSize', this.pagingParams.pageSize.toString());
        this.predicate.forEach((value, key) => {
            if (key === 'startDate') {
                params.append(key, (value as Date).toISOString());
            } else {
                params.append(key, value);
            }
        });
        return params;
    }

    setPredicate = (predicate: string, value: string | Date) => {
        const resetPredicate = () => {
            this.predicate.forEach((value, key) => {
                if (key !== 'startDate') this.predicate.delete(key);
            })
        }
        switch (predicate) {
            case 'all':
                resetPredicate();
                this.predicate.set('all', true);
                break;
            case 'isGoing':
                resetPredicate();
                this.predicate.set('isGoing', true);
                break;
            case 'isHost':
                resetPredicate();
                this.predicate.set('isHost', true);
                break;
            case 'startDate':
                this.predicate.delete('startDate');
                this.predicate.set('startDate', value);
                break;
        }
    }

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }


    /* Object.entries функция которая возвращает массив содержащий пары [ключ,значение]
     {} as {[key: string]: Activity[]}): Эта часть кода указывает начальное
     значение аккумулятора для метода reduce().
     В данном случае, начальное значение - пустой объект {},
     а тип аккумулятора задается как {[key: string]: Activity[]},
     что означает объект, где ключи являются строками, а значения - массивами активностей (Activity[]). */
    get groupedActivities() {
        return Object.entries(
            this.acitivityByDate.reduce((activities, activity) => {
                const date = format(activity.date!, 'dd MMM yyyy');
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;
            }, {} as { [key: string]: Activity[] })
        )
    }


    // функция которая делает асинхронный запрос,
    // отправяет элементы в коллекцию activityRegistry
    loadingActivities = async () => {
        this.setLoadingInitial(true);
        try {
            const result = await agent.Activities.list(this.axiosParams);
            result.data.forEach(activity => {
                this.setActivity(activity);
            })
            this.setPagination(result.pagination)
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    setPagination = (pagination: Pagination) => {
        this.pagination = pagination;
    }

    // функция которая делает асинхронный запрос в бд
    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.selectedActivity = activity;
            return activity;
        }
        else {
            this.setLoadingInitial(true);
            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(() => {
                    this.selectedActivity = activity;
                })
                this.setLoadingInitial(false);
                return activity;
            } catch (error) {
                console.log(error)
                this.setLoadingInitial(false);
            }
        }
    }

    private setActivity = (activity: Activity) => {
        /* получаем пользователя залогиненного */
        const user = store.userStore.user;
        if (user) {
            /* проверяем является ли он участником */
            activity.isGoing = activity.attendees!.some(
                a => a.userName === user.userName);
            /* проверяем является ли он хостом мероприятия*/
            activity.isHost = activity.hostUserName === user.userName;
            /* проверяем я вляется ли он хостом ? host this user : null */
            activity.host = activity.attendees?.find(x => x.userName === activity.hostUserName);
        }
        activity.date = new Date(activity.date!)
        this.activityRegistry.set(activity.id, activity);
    }

    // функция которая возвращает элемент коллекции по id
    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    // функция которая хранит состояние загрузки интерфейса
    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    // создает обьект который пришел параметром, отправяет его в бд и добавляет в нашу коллекцию
    createActivity = async (activity: ActivityFormValues) => {
        /*  добавляем user */
        const user = store.userStore.user;
        /*  создаем участника */
        const attendee = new Profile(user!);
        activity.id = uuid();
        try {
            /*  отправляем запрос с даными */
            await agent.Activities.create(activity);
            /* создаем дто */
            const newActivity = new Activity(activity)
            /* добавляем создателя мероприятия в хост */
            newActivity.hostUserName = user!.userName
            /* добавляем создателя мероприятия в участники  */
            newActivity.attendees = [attendee]
            /* прокидываем новое мероприятие в коллекцию activityRegistry и устанавливаем там значения*/
            this.setActivity(newActivity)
            runInAction(() => {
                /* добавляем мероприятие в selectedActivity */
                this.selectedActivity = newActivity;
            })
        } catch (error) {
            console.log(error);
        }
    }


    // функция добавляет новый обект по найденому ключу
    updateActivity = async (activity: ActivityFormValues) => {
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                if (activity.id) {
                    /* объединение */
                    let updatedActivity = { ...this.getActivity(activity.id), ...activity }
                    /* обновляем по ключу в коллекции (приводим к Activity) */
                    this.activityRegistry.set(activity.id, updatedActivity as Activity)
                    /* добавляем в selectedActivity */
                    this.selectedActivity = updatedActivity as Activity;
                }
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

    updateAttendance = async () => {
        const user = store.userStore.user;
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id) // выбранная активность
            /* Проверяем является ли user участником если нет, то
                   делаем фильтрацию если user есть то перезаписываем массив без него
                *  если обьекта user нету в масиве то isGoing = false и мы переходим к else
                *  и добавляем боба в массив после чего добавляем обновляем нашу коллекцию мероприятий
                *  activityRegistry, а если user изначально не участник, то просто добавляемя его
                *  */
            runInAction(() => {
                if (this.selectedActivity?.isGoing) {
                    this.selectedActivity.attendees =
                        this.selectedActivity.attendees?.filter(a => a.userName !== user?.userName)
                    this.selectedActivity.isGoing = false;
                } else {
                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!)
            })
        } catch (e) {
            console.log(e)
        } finally {
            runInAction(() => this.loading = false); // чтобы не случилось сработает после завершения
        }
    }

    /* метод отмены мероприятия */
    cancelActivityToggle = async () => {
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                this.selectedActivity!.isCancelled = !this.selectedActivity!.isCancelled;
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    cleareSelected = () => {
        this.selectedActivity = undefined;
    }

    updateAttendeeFollowing = (username: string) => {
        this.activityRegistry.forEach(activity => {
            activity.attendees.forEach(attendee => {
                if (attendee.userName === username) {
                    attendee.following ? attendee.followersCount-- : attendee.followersCount++;
                    attendee.following = !attendee.following;
                }
            })
        })
    }

}