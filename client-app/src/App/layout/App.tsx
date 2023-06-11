import {Container} from "semantic-ui-react";
import NavBar from "./navbar";
import MyImageShorthand from "./MyItem";
import { observer } from 'mobx-react-lite';
import { Outlet, useLocation } from 'react-router-dom';
import HomePage from "../../features/home/HomePage";

function App() {

  // получаем текущее местоположение
  const location = useLocation();
      
  return (
    <>
    {location.pathname === '/' ? <HomePage /> : (
      <>
       <NavBar />
       <Container style={{marginTop: '7em'}}>
           <Outlet />
           <MyImageShorthand />
       </Container>
      </>
    )}     
    </>
  );
}

// наблюдаемый App
export default observer(App);
