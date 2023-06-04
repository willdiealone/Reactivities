import React, {useState, useEffect} from 'react';
import axios from "axios";
import {Container} from "semantic-ui-react";
import {Activity} from "../models/activity";
import NavBar from "./navbar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashBoard";
import MyImageShorthand from "./MyItem";
import {v4 as uuid} from "uuid";
function App() {
    
  const [activities,setActivities] = useState<Activity[]>([]);
  
  const [selectedActivity, setSelectedActivity] = 
      useState<Activity | undefined>(undefined);
  
  const [editMode,setEditMode] = useState(false);
  
  const [editDetailsMode,setEditDetailsMode] = useState(false);
  
  useEffect(()=>{
      axios.get<Activity[]>('http://localhost:5434/api/Activities')
          .then((response)=>{
              setActivities(response.data);
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
    
    
    function handleCreateEditOrActivity(activity: Activity){
      activity.id
          ? setActivities([...activities.filter(x=>x.id !== activity.id), activity])
          : setActivities([...activities,{...activity, id: uuid()}]);
        setEditMode(false);
        setSelectedActivity(activity); 
    }
    
    // Функция которая удаляет элемент activities по заданному id,
    // удаляет таким образом, что он просто пересоздает новый массив и сравнивает их по id.
    // В итоге туда залетают все элементы не равные нашему id который мы сравниваем
    function handleDeleteActivity(id: string) {
      setActivities([...activities.filter(x=>x.id!==id)]);
        setEditDetailsMode(false);
    }
    
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
           />
           <MyImageShorthand />
       </Container>
    </>
  );
}

export default App;
