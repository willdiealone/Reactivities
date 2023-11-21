import React, {useEffect} from "react";
import ProfileHeader from "./ProfileHeader";
import {Grid} from "semantic-ui-react";
import ProfileContent from "./ProfileContent";
import {observer} from "mobx-react-lite";
import {useStore} from "../../App/stores/Store";
import {useParams} from "react-router-dom";
import LoadingComponent from "../../App/layout/LoadingComponent";
import MyImageShorthand from "../../App/layout/MyItem";

export default observer (function ProfilePage(){
    const {username} = useParams<{username: string}>()
    const {profileStore} = useStore()
    const {loadingProfile, loadProfile, profile,setActiveTab } = profileStore;
    
    useEffect(()=>{
        loadProfile(username!);
        return () => {
            setActiveTab(0);
        }
    },[loadProfile,username,setActiveTab])
    
    if (loadingProfile) return <LoadingComponent content={'Loading profile...'}/>
    
    return(
        <Grid>
            <Grid.Column width={16}>
                {profile &&
                    <>
                        <ProfileHeader profile={profile}/>
                        <ProfileContent profile={profile} />
                        <MyImageShorthand />                    
                    </>}
            </Grid.Column>
        </Grid>
    )
})