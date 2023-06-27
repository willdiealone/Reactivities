import { useEffect } from 'react';
import { Grid } from "semantic-ui-react";
import ActivityList from "./AcitivityList";
import { useStore } from '../../../App/stores/Store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../App/layout/LoadingComponent';
import ActivityFilters from './ActivityFilters';

export default observer(function ActivityDashboard() {

    const { activityStore } = useStore();
    const { loadingActivities, activityRegistry } = activityStore;

    useEffect(() => {
        if (activityRegistry.size <= 1) loadingActivities();
        //эффект будет выполнен, когда значение activityStore изменится.
    }, [activityRegistry.size,loadingActivities])

    if (activityStore.loadingInitial) return <LoadingComponent content={'Loading activities...'} />

    return (

        <Grid>
            <Grid.Column width='10'>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width='6'>
                <ActivityFilters />
            </Grid.Column>
        </Grid>
    )
})