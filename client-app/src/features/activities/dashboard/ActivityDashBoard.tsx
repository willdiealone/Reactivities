import { useEffect, useState } from 'react';
import { Button, Grid, Loader } from "semantic-ui-react";
import ActivityList from "./AcitivityList";
import { useStore } from '../../../App/stores/Store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../App/layout/LoadingComponent';
import ActivityFilters from './ActivityFilters';
import { PagingParams } from '../../../App/models/pagination';
import InfiniteScroll from 'react-infinite-scroller';
import ActivityListItemPlaceholder from './ActivityListItemPlaceholder';

export default observer(function ActivityDashboard() {

    const { activityStore } = useStore();
    const { loadingActivities, activityRegistry, pagination, setPagingParams } = activityStore;
    const [loadingNext, setLoadingNext] = useState(false);


    // изменяем параметры пагинации
    // и обновляем список мероприятий
    function handleGetNext() {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1));
        loadingActivities().then(() => setLoadingNext(false));
    }

    useEffect(() => {
        if (activityRegistry.size <= 1) loadingActivities();
        //эффект будет выполнен, когда значение activityStore изменится.
    }, [activityRegistry.size, loadingActivities])

    return (

        <Grid>
            <Grid.Column width='10'>
                {activityStore.loadingInitial && !loadingNext ? (
                    <>
                        <ActivityListItemPlaceholder />
                        <ActivityListItemPlaceholder />
                    </>
                ) : (
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={handleGetNext}
                        hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                        initialLoad={false}
                    >
                        <ActivityList />
                    </InfiniteScroll>
                )}
            </Grid.Column>
            <Grid.Column width='6'>
                <ActivityFilters />
            </Grid.Column>
            <Grid.Column width='16'>
                <Loader active={loadingNext} />
            </Grid.Column>
        </Grid>
    )
})