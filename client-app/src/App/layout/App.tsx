import React, {useEffect} from 'react';
import {Container} from "semantic-ui-react";
import NavBar from "./navbar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashBoard";
import MyImageShorthand from "./MyItem";
import LoadingComponent from "./LoadingComponent";
import { useStore } from '../stores/Store';
import { observer } from 'mobx-react-lite';

function App() {
    
  // Получаем контекст StoreContext
  const {activityStore} = useStore();

  useEffect(()=>{
      activityStore.loadingActivities();
      //эффект будет выполнен, когда значение activityStore изменится.
  },[activityStore])  
                   
  if(activityStore.loadingInitial) return <LoadingComponent content={'Loading app'} />
    
  return (
    <>
      <NavBar />
       <Container style={{marginTop: '7em'}}>
           <ActivityDashboard />
           <MyImageShorthand />
       </Container>
    </>
  );
}

// наблюдаемый App
export default observer(App);
