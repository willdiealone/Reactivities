import React from 'react';
import {Grid} from "semantic-ui-react";
import {Activity} from "../../../App/models/activity";
import ActivityList from "./AcitivityList";
import ActivityDetails from "../../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";

interface Props{
    
    // Массив обьектов Activity 
    activities: Activity[];
    
    // Выбранный обьект Activity
    selectedActivity: Activity | undefined;
    
    //Функция handleSelectActivity(id: string)
    selectActivity: (id: string) => void;
    
    // Функция hanldeCancelSelectActivity()
    cancelSelectActivity:() => void;
    
    // Переменная хука
    editMode: boolean

    // Функция  handleSelectActivity(id)
    openForm: (id:string) => void;

    // Функция handleFormClose()
    closeForm:() => void;

    // Функция handleCreateEditOrActivity
    createOrEdit: (activity:Activity) => void;

    // Функция handleDeleteActivity(id:string)
    deleteActivity:(id:string) => void;

    closeActivitiDetailsIfDelete: boolean
    
    
    
}


export default function ActivityDashboard({activities, selectedActivity, selectActivity, cancelSelectActivity,
                                          editMode,closeForm, openForm,createOrEdit,deleteActivity,closeActivitiDetailsIfDelete} : Props){
    return(
        <Grid>
            <Grid.Column width='10'>
           <ActivityList activities={activities}
                         selectActivity={selectActivity}
                         deleteActivity={deleteActivity}
           />
            </Grid.Column>
            <Grid.Column width='6'>
                {/* Проверка для окна Details (если в selectedActivity что-то есть, то выполняется ActivityDetails,
                а если нет то не выполняется, соответсвенно окно подгружается только тогда когда мы нажимаем на кнопку view
                в функции ActivityList в которой выполняется функция selectActivity которая возвращает обьект по id и после этого
                если как раз если selectedActivity не null, то ActivityDetails, когда нажимаем кнопку cancel идет функция
                  cancelSelectActivity которая selectedActivity делает null и ActivityDetails не выполняется)*/
                    selectedActivity && !editMode && closeActivitiDetailsIfDelete &&
            <ActivityDetails activity={selectedActivity}
                             cancelSelectActivity={cancelSelectActivity}
                             openForm={openForm}
            />}
                {editMode &&
                <ActivityForm closeForm={closeForm}
                              activity={selectedActivity}
                              createOrEdit={createOrEdit}
                />}
            </Grid.Column>
        </Grid>
    )
}