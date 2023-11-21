import React, {useEffect, useState} from "react";
import {Button, Grid, Header} from "semantic-ui-react";
import PhotoWidgetDropoZone from "./PhotoWidgetDropoZone";
import PhotoWidgetCropper from "./PhotoWidgetCropper";

interface Props{
    uploadPhoto: (file: Blob) => void,
    loading: boolean
}

export default function PhotoUploadWidget({uploadPhoto,loading}: Props) {
    
    const [files,setFiles] = useState<any>([])
    const [cropper,setCropper] = useState<Cropper>()
    
    function OnCropp() {
        if(cropper){
            cropper.getCroppedCanvas().toBlob(blob => uploadPhoto(blob!));
        }
    }
    
    useEffect(()=>{
        return () => {
            files.forEach((file:any)=> URL.revokeObjectURL(file.preview))
        }
    },[files])
    
    return(
        <Grid>
            <Grid.Column width={4}>
                <Header sub color={'teal'} content={'Step 1 - Add photo'}/>
                <PhotoWidgetDropoZone setFiles={setFiles}/>
            </Grid.Column>
            
            <Grid.Column width={1}/>
            
            <Grid.Column width={4}>
                <Header sub color={'teal'} content={'Step 2 - Resize image'}/>
                {files && files.length > 0 && (
                    <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview}/>
                )}
            </Grid.Column>
            
            <Grid.Column width={1}/>
            
            <Grid.Column width={4}>
                <Header sub color={'teal'} content={'Step 3 - Preview & Upload'}/>
                {files && files.length > 0 && 
                <>
                    <div className={'image-preview'} style={{minHeight: 200, overflow: 'hidden'}}/>
                    <Button.Group widths={2}>
                        <Button loading={loading}  onClick={OnCropp} positive icon={'check'}/>
                        <Button disabled={loading}  onClick={() => setFiles([])} icon={'close'}/>
                    </Button.Group>
                </>}
            </Grid.Column>
        </Grid>
    )
}