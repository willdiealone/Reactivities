import ActivityStore from "./ActivityStore";
import {createContext, useContext} from "react";


// создание интерфейса activityStore ActivityStore
interface Store {
    activityStore: ActivityStore
}



// константа которая имеет в свойстве новый обьект ActivityStore()
export const store: Store = {
    activityStore: new ActivityStore()
};




// константа StoreContext createContext(store) - создает контекст с начальным значением store. 
// Это означает, что любой компонент,
// который использует этот контекст, сможет получить доступ к store и его свойствам, включая activityStore. 
export const StoreContext = createContext(store);




// экспортируем функцию useStore() которая возвращает useContext(StoreContext)  
export function useStore() {
    return useContext(StoreContext);
}