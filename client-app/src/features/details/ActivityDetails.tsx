import React from 'react';
import {Button, Card, Image} from "semantic-ui-react";
import {Activity} from "../../App/models/activity";
interface Props{
    
    // Обьект Activity
    activity: Activity
    
    // Ничего не пиринмае и ничего не возвращает
    cancelSelectActivity:() => void;

    // Функция которая открывает форму редактирования если принимает по id элемент то вызывает функцию handleSelectActivity(id)
    // и устанавливает editMode в true, а если не принимает то вызывает hanldeCancelSelectActivity() 
    openForm: (id:string) => void;
    
}

export default function ActivityDetails({activity, cancelSelectActivity,openForm}: Props){
    
    return (
        <Card fluid>
            <Image src={`/assets/categoryImages/${activity.category}.jpg`} wrapped ui={false} />
            <Card.Content>
                <Card.Header>{activity.title}</Card.Header>
                <Card.Meta>
                    <span>{activity.date}</span>
                </Card.Meta>
                <Card.Description>
                    {activity.description }
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group widths='2' >
                    <Button onClick={ () => openForm(activity.id)} basic color='blue' content='Edit'/>
                    <Button onClick={() => cancelSelectActivity()} basic color='grey' content='Cancel'/>
                </Button.Group>
            </Card.Content>
        </Card>
    )
}