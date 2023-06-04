import React from 'react';
import {Activity} from "../../../App/models/activity";
import {Button, Item, Label, Segment} from "semantic-ui-react";
interface Props{
    
    // Массив обьектов Activity
    activities: Activity[];
    
    //function принимает обьект Activity по id
    selectActivity: (id: string) => void;

    // Функция handleDeleteActivity(id:string)
    deleteActivity:(id:string) => void;
    
    
}

export default function ActivityList({activities,selectActivity,deleteActivity}:Props){
    return(
        /* <Segment> является элементом из Semantic UI,
         который создает контейнер для других элементов и добавляет отступы и стилизацию.
        * devided => разделить
          <Item.Header> - это элемент заголовка внутри содержимого элемента списка.
           as='a' указывает, что заголовок будет отображаться как ссылка (<a>). */
        <Segment>
            <Item.Group  devided="true">
                {activities.map(activity=>(
                    <Item key={activity.id}>
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}, {activity.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button onClick={ () => selectActivity(activity.id)}  floated='right' content='View' color='blue' />
                                <Button onClick={()=>deleteActivity(activity.id)} floated='right' content='Delete' color='red'/>
                            </Item.Extra>
                            <Label basic content={activity.category} /*icon={activity.category}*//>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
}