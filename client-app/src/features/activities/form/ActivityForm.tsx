import {ChangeEvent, useEffect, useState} from "react";
import {Button, Form, Segment} from "semantic-ui-react";
import { useStore } from "../../../App/stores/Store";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { Activity } from "../../../App/models/activity";
import LoadingComponent from "../../../App/layout/LoadingComponent";

export default observer (function ActivityForm(){

    const {activityStore} = useStore();
    const {loading,createActivity,updateActivity,
        loadActivity,loadingInitial} = activityStore;

        // считываем id из url
    const {id} = useParams();    

    // хук который инициализилизирует activity пустой строкой
    const [activity,setActivity] = useState<Activity>({
        id: '',
        title: '',
        date: '',
        description: '',
        category: '',
        city: '',
        venue: ''
    });
    
    // хук который проверяет есть ли у нас id, если есть закидываем activity в хук useState
    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(activity!))
    },[id,loadActivity])
    
    // передаем на обьект в зависимости от наличия у него id
    function handleSubmit(){
        activity.id ? updateActivity(activity) : createActivity(activity);
    }
    
    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
        const {name,value} = event.target;
        setActivity({...activity,[name]:value})
    }
    
    if (loadingInitial) return <LoadingComponent content = 'Loading activity...'/>

    return(
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleInputChange} />
                <Form.TextArea placeholder='Description' value={activity.description} name='description' onChange={handleInputChange}/>
                <Form.Input placeholder='Category' value={activity.category} name='category' onChange={handleInputChange}/>
                <Form.Input type='date' placeholder='Date' value={activity.date} name='date' onChange={handleInputChange}/>
                <Form.Input placeholder='City' value={activity.city} name='city' onChange={handleInputChange}/>
                <Form.Input placeholder='Venue' value={activity.venue} name='venue' onChange={handleInputChange}/>
                <div className="ui buttons">
                <Button className="ui button" loading={loading} floated='right' positive type='submit' content='Submit'/>
                <div className="or"></div>
                <Button className="ui button" floated='right'  type='button' content='Cansel'/>
                </div>
            </Form>
        </Segment>
    )
})
