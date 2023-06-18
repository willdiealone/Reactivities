import {useStore} from "../../App/stores/Store";
import {observer} from "mobx-react-lite";
import {Container, Header, Segment} from "semantic-ui-react";

export default observer( function ServerError() {
    
    /* получаем обьект error */
    const {commonStore} = useStore();
    return (
        <Container>
            <Header as='h1' content={'ServerError'}></Header>
            <Header sub as={'h5'} color={'red'} content={commonStore.error?.message}></Header>
            {commonStore.error?.details && (
                <Segment>
                    <Header as={'h4'} content={'Stack trace'} color={'teal'}/>
                    <code style={{marginTop: '10px'}}>{commonStore.error.details}</code>
                </Segment>
            )}
        </Container>
    )
})