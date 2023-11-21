import React from "react";
import {observer} from "mobx-react-lite";
import {useStore} from "../../App/stores/Store";
import {Card, Grid, Header, Tab} from "semantic-ui-react";
import ProfileCard from "./ProfileCard";

export default observer( function ProfileFollowings(){
    
    const { profileStore} = useStore();
    const { loadingFollowings,profile,followings,activeTab} = profileStore;
    
    return(
         <Tab.Pane loading={loadingFollowings}>
             <Grid>
                 <Grid.Column width={16}>
                     <Header floated={"left"} icon={'user'} 
                             content={activeTab === 4 ? `People following ${profile?.displayName}` 
                                 : `People followers ${profile?.displayName}`}/>
                 </Grid.Column>
                 <Grid.Column width={16}>
                     <Card.Group itemsPerRow={4}>
                         {followings.map(profile => (
                             <ProfileCard profile={profile} key={profile.userName}/>
                         ))}
                     </Card.Group>
                 </Grid.Column>
             </Grid>
         </Tab.Pane>
    )
})