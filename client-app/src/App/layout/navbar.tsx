import React from 'react';
import {Button, Container, Menu} from "semantic-ui-react";
import { useStore } from '../stores/Store';
 

export default function NavBar(){
    
    const {activityStore}=useStore();

    return(
        
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item header>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight: '10px'}}/>
                    Reactivities
                </Menu.Item>
                <Menu.Item name='Activities'/>
                <Menu.Item>
                    <Button animated='fade' onClick={() => activityStore.openForm()} color='green'>
                        <Button.Content  visible>Create Activity</Button.Content>
                        <Button.Content hidden>user plus</Button.Content>
                    </Button>
                </Menu.Item>
            </Container>
        </Menu>
    )
}
