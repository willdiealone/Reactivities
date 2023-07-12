import { observer } from 'mobx-react-lite'
import {Segment, Header, Comment, Form, Button} from 'semantic-ui-react'
import {useStore} from "../../App/stores/Store";
import {useEffect} from "react";
import {Link} from "react-router-dom";

interface Props{
    activityId: string
}

export default observer(function ActivityDetailedChat({activityId}:Props) {
    
    const {commentStore} = useStore()
    
    useEffect(()=>{
        if(activityId){
            commentStore.createHubConnections(activityId);
        }
        return commentStore.clearComments();
    },[commentStore,activityId])
    
    return (
        <>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{border: 'none'}}
            >
                <Header>Chat about this event</Header>
            </Segment>
            <Segment attached>
                <Comment.Group>
                    {commentStore.comments.map(comments => (
                        <Comment key={comments.id}>
                            <Comment.Avatar src={comments.image || '/assets/user.png'}/>
                            <Comment.Content>
                                <Comment.Author as={Link} to={`/profiles/${comments.userName}`}>
                                    {comments.displayName}
                                </Comment.Author>
                                <Comment.Metadata>
                                    <div>{comments.CreatedAt }</div>
                                </Comment.Metadata>
                                <Comment.Text>{comments.body}</Comment.Text>
                            </Comment.Content>
                        </Comment>
                    ))}
                    <Form reply>
                        <Form.TextArea/>
                        <Button
                            content='Add Reply'
                            labelPosition='left'
                            icon='edit'
                            primary
                        />
                    </Form>
                </Comment.Group>
            </Segment>
        </>
    )
})