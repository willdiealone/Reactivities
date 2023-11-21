import React from "react";
import {Tab} from "semantic-ui-react";
import ProfilePhotos from "./ProfilePhotos";
import {Profile} from "../../App/models/profile";
import {observer} from "mobx-react-lite";
import ProfileAbout from "./ProfileAbout";
import ProfileFollowings from "./ProfileFollowings";
import {useStore} from "../../App/stores/Store";
import ProfileActivities from "./ProfileActivities";

interface Props{
    profile: Profile
}

export default observer( function ProfileContent( {profile}: Props){

    const {profileStore} = useStore();
    
    const myPanes = [
        {menuItem: 'About', render: () => <ProfileAbout />},
        {menuItem: 'Photos', render: () => <ProfilePhotos profile={profile}/>},
        {menuItem: 'Events', render: () => <ProfileActivities />},
        {menuItem: 'followers', render: () => <ProfileFollowings />},
        {menuItem: 'following', render: () => <ProfileFollowings />}
    ]
    return(
        <Tab
            menu={{fluid: true, vertical: true}}
            menuPosition={'right'}
            panes={myPanes}
            //передаем индекс активной вкладки
            onTabChange={(e,data) => profileStore.setActiveTab(data.activeIndex)}
        />
    )
})