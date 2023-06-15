import { Header, Icon, Segment } from "semantic-ui-react";

export default function NotFound() {
    return (
        <Segment placeholder>
          <Header icon>
            <Icon name = 'search'/>
                Page Not Found
                
          </Header>
        </Segment>
    )
}