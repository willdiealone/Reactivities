import React from "react";
import {Button, Icon, Item, Label, Segment} from "semantic-ui-react";
import { Activity } from "../../../App/models/activity";
import { Link, } from "react-router-dom";
import {format} from "date-fns";
import ActivityListItemAttendees from "./ActivityListItemAttendees";

interface Props {
    activity: Activity,
}

export default function ActivityListItem({ activity }: Props) {

   // const [ setTarget] = useState('');
    //const { activityStore } = useStore();
    //const { deleteActivity } = activityStore;

    // function handleActivityDelete(e: SyntheticEvent<HTMLButtonElement>, id: string) {
    //     setTarget(e.currentTarget.name);
    //     deleteActivity(id);
    // }
    return (
        <Segment.Group >
            <Segment >
                {activity.isCancelled &&
                    <Label attached={'top'} color={'red'} content={'Cancelled'} style={{textAlign: 'center'}}/>
                }
                <Item.Group >
                    <Item >
                        <Item.Image style={{marginBottom: 3}} size='tiny' circular src={activity.host?.image || '/assets/user.png'} />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`}>
                                {activity.title}
                            </Item.Header>
                            <Item.Description> Hosted by <Link to={`/profiles/${activity.host?.userName}`}>
                                     {activity.host?.displayName}</Link>
                            </Item.Description>
                            {activity.isHost && 
                                <Item.Description>
                                    <Label basic color={'orange'}>You are hosting this Activity</Label>
                                </Item.Description>
                            }
                            {activity.isGoing && !activity.isHost && 
                                <Item.Description>
                                    <Label basic color={'green'}>You are going to this Activity</Label>
                                </Item.Description>
                            }
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name='clock' /> {format(activity.date!,'dd MMM yyyy h:mm aa')}
                    <Icon name='marker' /> {activity.venue}
                </span>
            </Segment>
            <Segment secondary >
                <ActivityListItemAttendees attendees={activity.attendees!}/>
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button animated className="right ui button"
                    as={Link} to={`/activities/${activity.id}`}
                    floated='right' color='blue' >
                    <Button.Content visible>View</Button.Content>
                    <Button.Content hidden>
                        <Icon name='hand point right' />
                    </Button.Content>
                </Button>
                {/*<Button name={activity.id} animated='vertical'*/}
                {/*    loading={loading && target === activity.id}*/}
                {/*    className="ui button right"*/}
                {/*    onClick={(e) => handleActivityDelete(e, activity.id)}*/}
                {/*    floated='right' color='red'>*/}
                {/*    <Button.Content visible>Delete</Button.Content>*/}
                {/*    <Button.Content hidden>*/}
                {/*        <Icon name='trash' />*/}
                {/*    </Button.Content>*/}
                {/*</Button>*/}
            </Segment>
        </Segment.Group>
    )
}




