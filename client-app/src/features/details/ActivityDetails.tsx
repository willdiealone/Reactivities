import { Grid } from "semantic-ui-react";
import { useStore } from '../../App/stores/Store';
import LoadingComponent from '../../App/layout/LoadingComponent';
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import ActivityDetailedHeader from "./ActivityDetailsHeader";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActivityDetailedChat from "./ActivityDetailedChat";
import ActivityDetailedSideBar from "./ActivityDetailedSideBar";

export default observer(function ActivityDetails() {

    const { activityStore } = useStore();
    const { selectedActivity: activity, loadActivity, loadingInitial, cleareSelected } = activityStore;

    // считываем id из url
    const { id } = useParams();

    // обновляем если изменился id или loadActivity
    useEffect(() => {
        if (id) loadActivity(id)
        return () => cleareSelected();
    }, [id, loadActivity, cleareSelected])

    if (loadingInitial || !activity) return <LoadingComponent />;

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailedHeader activity={activity} />
                <ActivityDetailedInfo activity={activity} />
                <ActivityDetailedChat activityId={activity.id} />
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailedSideBar activity={activity} />
            </Grid.Column>
        </Grid>
    )
})

