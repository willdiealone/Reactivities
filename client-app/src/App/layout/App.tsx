import {Container} from "semantic-ui-react";
import NavBar from "./navbar";
import MyImageShorthand from "./MyItem";
import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router-dom';

function App() {
      
  return (
    <>
      <NavBar />
       <Container style={{marginTop: '7em'}}>
           <Outlet />
           <MyImageShorthand />
       </Container>
    </>
  );
}

// наблюдаемый App
export default observer(App);
