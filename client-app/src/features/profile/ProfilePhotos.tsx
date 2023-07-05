import React, {SyntheticEvent, useState} from "react";
import {observer} from "mobx-react-lite";
import {useStore} from "../../App/stores/Store";
import {Header, Tab, Card, Image, Grid, ButtonOr, Button} from "semantic-ui-react";
import {Photo, Profile} from "../../App/models/profile";
import PhotoUploadWidget from "../../App/common/imageUpload/PhotoUploadWidget";

interface Props{
    profile: Profile
}
export default observer( function ProfilePhotos({profile}: Props) {
    
    const {profileStore:{isCurrentUser, ulpoadPhoto,upLoading,
         loading,setMainPhoto,deletePhoto}} = useStore();
    const [addPhotoMode,setPhotoMode] = useState(false);
    
    const [target,seTarget] = useState('');
    
    function handlePhotoUpload(file: Blob) {
        ulpoadPhoto(file).then(()=> setPhotoMode(false))
    }
    
    function handleSetMainPhoto(photo: Photo,e: SyntheticEvent<HTMLButtonElement>) {
        seTarget(e.currentTarget.name);
        setMainPhoto(photo)
    }

    function handleDeletePhoto(photo: Photo,e: SyntheticEvent<HTMLButtonElement>) {
        seTarget(e.currentTarget.name);
        deletePhoto(photo);
    }
    
    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated={'left'} icon={'image'} content={'Photos'} />
                    {isCurrentUser && (
                        <Button floated={'right'}  
                                basic content={addPhotoMode ? 'Cancel' : 'Add Photo'}
                                onClick={() => setPhotoMode(!addPhotoMode)}
                        />
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ? (
                        <PhotoUploadWidget uploadPhoto={handlePhotoUpload} loading={upLoading} />
                    ): (
                        <Card.Group itemsPerRow={5}>
                            {profile.photos?.map((photo)=> (
                                <Card key={photo.id}>
                                    <Image src={photo.url}/>
                                    {isCurrentUser && (
                                        <Button.Group fluid widths={2}>
                                            <Button basic color={'green'} content={'Main'} name={'main' + photo.id}
                                                    disabled={photo.isMain}
                                                    onClick={e => handleSetMainPhoto(photo,e)}
                                                    loading={loading && target === 'main' + photo.id}
                                            />
                                            <Button basic color={'red'} icon={'trash'}
                                                    name={'delete' + photo.id}
                                                    loading={loading && target === 'delete' + photo.id}
                                                    onClick={e => handleDeletePhoto(photo,e)}
                                                    disabled={photo.isMain}
                                            />
                                        </Button.Group>
                                    )}
                                </Card>
                            ))}
                        </Card.Group>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})