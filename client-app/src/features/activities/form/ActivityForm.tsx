 import {useEffect, useState} from "react";
import {Button, Header, Segment} from "semantic-ui-react";
import { useStore } from "../../../App/stores/Store";
import { observer } from "mobx-react-lite";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Activity, ActivityFormValues} from "../../../App/models/activity";
import LoadingComponent from "../../../App/layout/LoadingComponent";
import {Formik, Form} from "formik";
import * as Yup from 'yup';
import MyTextInput from "../../../App/common/form/MyTextInput";
import MyTextArea from "../../../App/common/form/MyTextArea";
import SelectInput from "../../../App/common/form/SelectInput";
import {CategoryOptions} from "../../../App/common/options/CategoryOptions";
import MyDateInput from "../../../App/common/form/MyDateInput";
import {v4 as uuid} from 'uuid';

export default observer (function ActivityForm(){

    const {activityStore} = useStore();
    const {loading,createActivity,updateActivity,
        loadActivity,loadingInitial} = activityStore;

    // хук который производит навигацию    
    const navigate = useNavigate();

        // считываем id из url
    const {id} = useParams();    

    // хук который инициализилизирует activity пустой строкой
    const [activity,setActivity] = useState<ActivityFormValues>(new ActivityFormValues());
    
    // хук который проверяет есть ли у нас id, если есть закидываем activity в хук useState
    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(new ActivityFormValues(activity)))
    },[id,loadActivity])
    
    
    // передаем на обьект в зависимости от наличия у него id
    function handleFormSubmit (activity: ActivityFormValues){
        console.log('Submitted activity:', activity);
        if (!activity.id){
            activity.id = uuid();
            // говорим куда хотим перейти после создания обьекта
             createActivity(activity).then(()=> navigate(`/activities/${activity.id}`))
        }
        else{
             updateActivity(activity).then(()=> navigate(`/activities/${activity.id}`))
        }
    }

    
    const validationSchema = Yup.object({
        title: Yup.string().required('The Activity Title is required'),
        description: Yup.string().required('The Activity Description is required'),
        category: Yup.string().required('The Activity Category is required'),
        date: Yup.string().required('The Activity Date is required'),
        city: Yup.string().required('The Activity City is required'),
        venue: Yup.string().required('The Activity Venue is required')
    })
    
    if (loadingInitial) return <LoadingComponent content = 'Loading activity...'/>
    
   
    
    return( 
        <Segment clearing>
            <Header content={'Activity Details'} sub color={'teal'}/>
            <Formik
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={activity}
                onSubmit={values => handleFormSubmit(values)}>
                {({handleSubmit, isValid,isSubmitting,dirty}) => (
                    <Form className={'ui form'} onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInput placeholder={'Title'} name={'title'} />
                        <MyTextArea rows={3} placeholder='Description' name='description'/>
                        <SelectInput options={CategoryOptions} placeholder='Category' name='category'/>
                        <MyDateInput
                            placeholderText='Date'
                            name='date'
                            timeInputLabel={"Time: "}
                            timeFormat={"HH:mm"}
                            dateFormat={"MMMM d, yyyy h:mm aa"}
                            showTimeInput
                        />
                        <Header content={'Location Details'} sub color={'teal'}/>
                        <MyTextInput placeholder='City' name='city'/>
                        <MyTextInput placeholder='Venue' name='venue'/>
                        <Button
                            disabled={isSubmitting || !dirty || !isValid}
                            className="ui button"
                            loading={isSubmitting}
                            floated='right'
                            positive
                            type='submit'
                            content='Submit'
                        />
                        <Button 
                            as={Link} to='/activities'
                            className="ui button"
                            floated='right'
                            type='button'
                            content='Cansel'
                        />
                    </Form>
                )}
            </Formik>
        </Segment>
    )
})
