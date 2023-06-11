import React, {SyntheticEvent, useState} from 'react';
import {Button, Icon, Item, Label, Segment} from "semantic-ui-react";
import { useStore } from '../../../App/stores/Store';
import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';

export default observer (function ActivityList(){
    
    const [target,setTarget] = useState('');
    const {activityStore} = useStore();
    const {deleteActivity,loading,acitivityByDate} = activityStore;

    function handleActivityDelete(e: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(e.currentTarget.name);
        deleteActivity(id);
    }
    
    return(
        <Segment>
            <Item.Group devided="true">
                {acitivityByDate.map(activity=>(
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
                                    className="right ui button"
                                    as={NavLink} to={`/activities/${activity.id}`}
                                    floated='right'
                                    color='blue' >
                                    <Button.Content visible>View</Button.Content>
                                    <Button.Content hidden>
                                        <Icon name='hand point right' />
                                    </Button.Content>
                                </Button>
                                 <Button 
                                     name={activity.id}
                                     animated='vertical'
                                     loading={loading && target === activity.id}
                                     className="ui button right"
                                     onClick={(e)=> handleActivityDelete(e,activity.id)}
                                     floated='right'
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
})