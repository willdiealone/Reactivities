import { Label } from 'semantic-ui-react'


const MyImageShorthand = () => (
    <div>
        <Label as='a' color='teal' image style={{marginTop:'10px', marginLeft:'500px',marginBottom:'10px'}}>
            <img src='/assets/sema.png'/>
            Dennis Pro Max
            <Label.Detail>Creator</Label.Detail>
        </Label>
    </div>
)

export default MyImageShorthand

