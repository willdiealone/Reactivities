import {Message, MessageList} from "semantic-ui-react";

interface Props {
    errors: string[]; 
}

export default function ValidationError({errors}: Props) {
    return (
         <Message error>
             {errors && (
                 <MessageList>
                     {errors.map((error: string,i: number) => (
                        <Message.Item key={i}>{error}</Message.Item>
                     ))}
                 </MessageList>
             )}
         </Message>
    )
}