import  {Container} from "semantic-ui-react";
import NavBar from "./navbar";
import MyImageShorthand from "./MyItem";
import { observer } from 'mobx-react-lite';
import {Outlet, ScrollRestoration, useLocation} from 'react-router-dom';
import HomePage from "../../features/home/HomePage";
import {ToastContainer} from "react-toastify";
import React, {useEffect} from "react";
import {useStore} from "../stores/Store";
import LoadingComponent from "./LoadingComponent";
import ModalContainer from "../common/modals/ModalContainer";

function App() {

  // получаем текущее местоположение
  const location = useLocation();
  
  const {userStore,commonStore} = useStore();
  
  useEffect(()=>{
    if(commonStore.token){
      userStore.getUser().finally(() => commonStore.setAppLoaded()) 
    }else {
      commonStore.setAppLoaded();
    }
  },[userStore,commonStore])
      
  if(!commonStore.appLoaded) return <LoadingComponent content={'Loading app...'}/>
   
  return (
    <>
      <ScrollRestoration/>
      <ModalContainer/>
      <ToastContainer position="bottom-right" hideProgressBar theme={"colored"} />
      {location.pathname === '/' ? <HomePage /> : (
      <>
       <NavBar/>
       <Container style={{marginTop: '7em'}}>
           <Outlet />           
       </Container>
      </>
    )}     
    </>
  );
}

// наблюдаемый App
export default observer(App);
