import {Button, Header, Icon, Segment} from "semantic-ui-react";
import {Link} from "react-router-dom";

export default function NotFound() {
    return (
        <Segment placeholder >
            <Header icon>
                <Icon name={"search"}/>
                Oops we`ve looked everywhare but could not find you are looking for! 
            </Header>
            <Segment.Inline>
                <Button animated='fade' as={Link} to={'/activities'} color='blue'>
                    <Button.Content  visible> Return to activities page</Button.Content>
                    <Button.Content hidden>
                        <Icon name='users' />
                    </Button.Content>
                </Button>
            </Segment.Inline>
        </Segment>
    )
}