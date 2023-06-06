import React, {SyntheticEvent, useState} from 'react';
import {Activity} from "../../../App/models/activity";
import {Button, Icon, Item, Label, Segment} from "semantic-ui-react";
import {Simulate} from "react-dom/test-utils";
import submit = Simulate.submit;
interface Props{
    
    // Массив обьектов Activity
    activities: Activity[];
    
    //function принимает обьект Activity по id
    selectActivity: (id: string) => void;

    // Функция handleDeleteActivity(id:string)
    deleteActivity:(id:string) => void;

    submitting: boolean;
    
    
}

export default function ActivityList({activities,selectActivity,deleteActivity,submitting}:Props){
    
    const [target,setTarget] = useState('');
    
    function handleActivityDelete(e: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(e.currentTarget.name);
        deleteActivity(id);
    }
    
    return(
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
                                <div>
                                <Button 
                                    animated
                                    class="right ui button"
                                    onClick={ () => selectActivity(activity.id)}
                                    floated='right'
                                    color='blue' >
                                    <Button.Content visible>View</Button.Content>
                                    <Button.Content hidden>
                                        <Icon name='hand point right' />
                                    </Button.Content>
                                </Button>
                                 <Button 
                                     name={activity.id}
                                     animated 
                                     loading={submitting && target === activity.id}
                                     class="ui button right"
                                     onClick={(e)=> handleActivityDelete(e,activity.id)}
                                     floated='right'
                                     content='Delete'
                                     color='red'>
                                <Button.Content visible>Delete</Button.Content>
                                <Button.Content hidden>
                                    <Icon name='trash' />
                                </Button.Content>
                                </Button>
                                </div>
                            </Item.Extra>
                            <Label basic content={activity.category}/>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
}