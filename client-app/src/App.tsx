import React, {useState, useEffect} from 'react';
import './App.css';
import axios from "axios";
import {Button, Header, List, ListItem} from "semantic-ui-react";
function App() {
    
  const [activities,setActivities] = useState([])
  useEffect(()=>{
      axios.get('http://localhost:5434/Activities')
          .then((response)=>{
              setActivities(response.data);
          })
  },[])
  return (
      // добавляем компонент Semantic Ui 'Header' которому говрим что он будет использоваться в
      // качестве заголовка h2, задаем иконку и тип контента
    <div>
      <Header  as='h2' icon='users' content="Reactivities"/>
        <List>
            {activities.map((activity :any) =>(
                <ListItem key={activity.id}>
                    {activity.title}
                </ListItem>
            ))}
        </List>
        <Button content='Test'/>
    </div>
  );
}
export default App;
