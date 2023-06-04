import React from 'react';
import {Button, Container, Menu} from "semantic-ui-react";
 
interface Props{

    // Функция  handleSelectActivity(id)
    openForm: () => void;
}

export default function NavBar({openForm}:Props){
    return(
        /* Button positive => сделает кнопку зеленой
        * Menu inverted fixed='top => обратные цвета, фиксированная позиция сверху
        * Menu.Item header => заголовок
        * img src="/assets/logo.png" alt="logo" => источник, альтернативный текст
        * style={{marginRight: '10px'}} => отступ справа 10 пикс. */
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item header>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight: '10px'}}/>
                    Reactivities
                </Menu.Item>
                <Menu.Item name='Activities'/>
                <Menu.Item>
                    <Button onClick={openForm} positive content='Create Activity' />
                </Menu.Item>
            </Container>
        </Menu>
    )
}