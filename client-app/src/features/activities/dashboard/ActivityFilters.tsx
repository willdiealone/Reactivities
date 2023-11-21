import Calendar from "react-calendar";
import { Header, Menu } from "semantic-ui-react";
import 'react-calendar/dist/Calendar.css';
import { observer } from "mobx-react-lite";
import { useStore } from "../../../App/stores/Store";

export default observer ( function ActivityFilters() {
    const {activityStore: {predicate, setPredicate}} = useStore();

    return (
        <>
            <Menu vertical size='large' style={{ width: '100%', marginTop: '6.8%' }}>
                <Header icon='filter' attached color={"teal"} content='Filters' />
                <Menu.Item
                    content='All`s Activities'
                    active={predicate.has('all')}
                    onClick={() => setPredicate('all','true')}
                />
                <Menu.Item
                    content='I`m going'                     
                    active={predicate.has('isGoing')}
                    onClick={() => setPredicate('isGoing','true')}
                />
                <Menu.Item 
                    content='i`m hosting'                
                    active={predicate.has('isHost')}
                    onClick={() => setPredicate('isHost','true')}
                />
            </Menu>
            <Header />
            <Calendar 
                onChange={(date) => setPredicate('startDate',date as Date)}
                value={predicate.get('startDate' || new Date())}
            />
        </>
    )
})