import {Grid} from "semantic-ui-react";
import { useStore } from '../../App/stores/Store';
import LoadingComponent from '../../App/layout/LoadingComponent';
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import ActivityDetailedHeader from "./ActivityDetailsHeader";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActivityDetailedChat from "./ActivityDetailedChat";
import ActivityDetailedSideBar from "./ActivityDetailedSideBar";

export default observer (function ActivityDetails(){

    const {activityStore} = useStore();
    const {selectedActivity: activity,loadActivity,loadingInitial} = activityStore;

    // считываем id из url
    const {id} = useParams();

    // обновляем если изменился id
    useEffect(() => {
        if (id) loadActivity(id)
    },[id,loadActivity])

    if(loadingInitial || !activity) return <LoadingComponent/>;
    
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailedHeader activity={activity}/>
                <ActivityDetailedInfo activity={activity}/>
                <ActivityDetailedChat/>
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailedSideBar activity={activity}/>
            </Grid.Column>
        </Grid>
    )
})

