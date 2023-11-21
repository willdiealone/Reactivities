import React from "react";
import {observer} from "mobx-react-lite";
import {List, Image, Popup} from "semantic-ui-react";
import {Profile} from "../../../App/models/profile";
import {Link} from "react-router-dom";
import ProfileCard from "../../profile/ProfileCard";



interface Props {
    attendees: Profile[]
}

export default observer( function ActivityListItemAttendees({attendees}: Props) {
    
    const styles = {
        borderColor: 'orange',
        borderWidth: 3
    }
    
    return (
        <List horizontal>
            {attendees.map(attendee => (
                <Popup hoverable key={attendee.userName} trigger={
                    <List.Item key={attendee.userName} as={Link} to={`/profiles/${attendee.userName}`}>
                        <Image 
                            size={'mini'} 
                            circular src={attendee.image || '/assets/user.png'}
                            bordered
                            style={attendee.following ? styles : null}
                        />
                    </List.Item>
                }>
                    <Popup.Content>
                        <ProfileCard profile={attendee}/>
                    </Popup.Content>
                </Popup>
            ))}
        </List>      
    )
})