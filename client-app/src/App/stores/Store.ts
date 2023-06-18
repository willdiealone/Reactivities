import ActivityStore from "./ActivityStore";
import {createContext, useContext} from "react";
import CommonStore from "./commonStore";


/* создание интерфейса activityStore ActivityStore и commonStore CommonStore*/ 
interface Store {
    activityStore: ActivityStore
    commonStore: CommonStore
}



/* константа которая имеет в свойстве новый обьект ActivityStore() и CommonStore() */
export const store: Store = {
    activityStore: new ActivityStore(),
    commonStore: new CommonStore()
};




// константа StoreContext createContext(store) - создает контекст с начальным значением store. 
// Это означает, что любой компонент,
// который использует этот контекст, сможет получить доступ к store и его свойствам, включая activityStore. 
export const StoreContext = createContext(store);




// экспортируем функцию useStore() которая возвращает useContext(StoreContext)  
export function useStore() {
    return useContext(StoreContext);
}