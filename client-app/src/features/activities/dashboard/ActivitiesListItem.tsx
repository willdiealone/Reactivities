import { SyntheticEvent, useState } from "react";
import { Button, Icon, Item, Segment } from "semantic-ui-react";
import { Activity } from "../../../App/models/activity";
import { Link, } from "react-router-dom";
import { useStore } from "../../../App/stores/Store";
import {format} from "date-fns";



interface Props {
    activity: Activity,
}


export default function ActivityListItem({ activity }: Props) {

    const [target, setTarget] = useState('');
    const { activityStore } = useStore();
    const { deleteActivity, loading } = activityStore;

    function handleActivityDelete(e: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(e.currentTarget.name);
        deleteActivity(id);
    }

    return (
        <Segment.Group >
            <Segment >
                <Item.Group >
                    <Item >
                        <Item.Image size='tiny' circular src='/assets/user.png' />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`}>
                                {activity.title}
                            </Item.Header>
                            <Item.Description>Hosted by Bob </Item.Description>
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
                Attendees go here
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
                <Button name={activity.id} animated='vertical'
                    loading={loading && target === activity.id}
                    className="ui button right"
                    onClick={(e) => handleActivityDelete(e, activity.id)}
                    floated='right' color='red'>
                    <Button.Content visible>Delete</Button.Content>
                    <Button.Content hidden>
                        <Icon name='trash' />
                    </Button.Content>
                </Button>
            </Segment>
        </Segment.Group>
    )
}




