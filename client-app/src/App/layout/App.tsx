import React, {useState, useEffect} from 'react';
import {Container} from "semantic-ui-react";
import {Activity} from "../models/activity";
import NavBar from "./navbar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashBoard";
import MyImageShorthand from "./MyItem";
import {v4 as uuid} from "uuid";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";
function App() {
    
  const [activities,setActivities] = useState<Activity[]>([]);
  
  const [selectedActivity, setSelectedActivity] = 
      useState<Activity | undefined>(undefined);
  
  const [editMode,setEditMode] = useState(false);
  
  const [editDetailsMode,setEditDetailsMode] = useState(false);
  
  const [loading,setLoading] = useState(true);
  
  const [submitting, setSubmitting] = useState(false);
  
    // хук который делает запрос.
    // Получая ответ мы создаем новый массив activities проходим циклом и убираем время оставляя только дату
    // после чего пинициализируем наш массив и передаем его в переменую хука activities.
  useEffect(()=>{
      agent.Activities.list().then(( response)=>{
          let activities: Activity[] = [];
          response.forEach(activity => {
              activity.date = activity.date.split('T')[0];
              activities.push(activity);
          })
              setActivities(activities);
          setLoading(false);
          })
  },[])
    
    // Функция находит из массива activities[] элемент по id
    function handleSelectActivity(id: string){
        setSelectedActivity(activities.find(x =>x.id === id));
        setEditDetailsMode(true);
    }

    // Отмена
    function hanldeCancelSelectActivity(){
        setSelectedActivity(undefined);
        setEditDetailsMode(false);
    }
    
    // Функция которая открывает форму редактирования если принимает по id элемент то вызывает функцию handleSelectActivity(id)
    // и устанавливает editMode в true, а если не принимает то вызывает hanldeCancelSelectActivity() 
    function handleFormOpen(id?:string){
      id ? handleSelectActivity(id) : hanldeCancelSelectActivity()
        setEditMode(true);
    }
    
    // Функция которая закрывает форму редактирования и устанавливает editMode в false
    function handleFormClose(){
      setEditMode(false);
    }
    
    //  В этом коде мы сравниваем значение свойства id объекта activity с id каждого элемента в массиве activities.
    //  Если activity существует в массиве activities, мы обновляем его значения.
    //  Если activity новый и не существует в массиве activities, мы добавляем его в массив создавая ему новый id.
    function handleCreateEditOrActivity(activity: Activity){
      setSubmitting(true)
        if(activity.id){
            agent.Activities.update(activity).then(()=> {
                setActivities([...activities.filter(x=>x.id !== activity.id), activity])
                setSelectedActivity(activity);
                setEditMode(false);
                setSubmitting(false);
            })
                .catch(error => {
                    console.log(error.response.status);
                    console.log(error.response.statusText);
                    console.log(error.response.data);
                    // Дополнительная обработка ошибки
                });
        }
        else{
        activity.id = uuid();
        agent.Activities.create(activity).then(() => {
            setActivities([...activities, {...activity, id: uuid()}])
            setSelectedActivity(activity);
            setEditMode(false);
            setSubmitting(false);
        })
            .catch(error => {
                console.log(error.response.status);
                console.log(error.response.statusText);
                console.log(error.response.data);
                // Дополнительная обработка ошибки
            });
        }
    }
    
    // Функция которая удаляет элемент activities по заданному id,
    // удаляет таким образом, что он просто пересоздает новый массив и сравнивает их по id.
    // В итоге туда залетают все элементы не равные нашему id который мы сравниваем
    function handleDeleteActivity(id: string) {
      setActivities([...activities.filter(x=>x.id!==id)]);
        setEditDetailsMode(false);
    }
    
    if(loading) return <LoadingComponent content={'Loading app'} />
    
  return (
    <>
      <NavBar openForm={handleFormOpen}/>
       <Container style={{marginTop: '7em'}}>
           <ActivityDashboard activities={activities} 
                              selectedActivity={selectedActivity}
                              selectActivity={handleSelectActivity}
                              cancelSelectActivity={hanldeCancelSelectActivity}
                              editMode={editMode}
                              openForm={handleFormOpen}
                              closeForm={handleFormClose}
                              createOrEdit={handleCreateEditOrActivity}
                              deleteActivity={handleDeleteActivity}
                              closeActivitiDetailsIfDelete={editDetailsMode}
                              submitting={submitting}
           />
           <MyImageShorthand />
       </Container>
    </>
  );
}

export default App;
