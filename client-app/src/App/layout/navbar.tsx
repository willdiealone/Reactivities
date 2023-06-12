import {Button, Container, Menu} from "semantic-ui-react";
import { NavLink } from 'react-router-dom';
 

export default function NavBar(){    

    return(
        
        <Menu inverted fixed='top'>
            <Container >
                <Menu.Item as={NavLink} to='/' header >
                    <img src="/assets/logo.png" alt="logo" style={{marginRight: '10px'}}/>
                    Reactivities
                </Menu.Item>
                <Menu.Item as={NavLink} to='/activities'name='Activities'/>
                <Menu.Item >
                    <Button animated='fade' as={NavLink} to='createActivity' color='green'>
                        <Button.Content  visible>Create Activity</Button.Content>
                        <Button.Content hidden>user plus</Button.Content>
                    </Button>
                </Menu.Item>
            </Container>
        </Menu>
    )
}
