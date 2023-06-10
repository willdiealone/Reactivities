import { useEffect } from 'react';
import {Grid} from "semantic-ui-react";
import ActivityList from "./AcitivityList";
import { useStore } from '../../../App/stores/Store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../App/layout/LoadingComponent';

export default observer (function ActivityDashboard(){
    
    const {activityStore} = useStore();                                                         

  useEffect(()=>{
      activityStore.loadingActivities();
      //эффект будет выполнен, когда значение activityStore изменится.
  },[activityStore])  
                   
  if(activityStore.loadingInitial) return <LoadingComponent content={'Loading app'} />

    return(
        
        <Grid>
            <Grid.Column width='10'>
           <ActivityList/>
            </Grid.Column>

            <Grid.Column width='6'>
           <h2>Activity Filters</h2>
            </Grid.Column>
        </Grid>
    )
})