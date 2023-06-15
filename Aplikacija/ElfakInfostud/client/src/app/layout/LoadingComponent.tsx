import { Dimmer, Loader } from "semantic-ui-react";

export default function LoadingComponent() {
    return(
        <Dimmer active = {true} inverted = {true}>
            <Loader content = 'Loading...'/>
        </Dimmer>
    )
}