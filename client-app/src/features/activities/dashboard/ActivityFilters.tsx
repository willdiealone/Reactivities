import Calendar from "react-calendar";
import { Header, Menu } from "semantic-ui-react";
import 'react-calendar/dist/Calendar.css';

export default function ActivityFilters() {

    return (
        <>
            <Menu vertical size='large' style={{ width: '100%', marginTop: '6.8%' }}>
                <Header icon='filter' attached color={"teal"} content='Filters' />
                <Menu.Item content='All`s Activities' />
                <Menu.Item content='I`m going' />
                <Menu.Item content='i`m hosting' />
            </Menu>
            <Header />
            <Calendar />
        </>
    )
}