import { observer } from "mobx-react-lite"
import { Button, Header, Item, Label, Segment, Sticky } from "semantic-ui-react"
import { Post } from "../../../app/domain/post";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../../../app/stores/store";

interface Props {
    post : Post;
}

export default observer (function PostMainInfo({post}:Props){

    const {postStore,accountStore} = useStore();
    const navigate = useNavigate();

    function deletePost(id:string) {
        postStore.deletePost(id).then(()=>
        navigate('/posts'));
    }

    return(
        <Segment.Group >

        <Segment>
            <Item.Group>

            <Item>
                
                    <Item.Header as='h1' >
                        {post.title}
                    </Item.Header>
            </Item>
            <Item>
                  <Label>
                        {post.category}
                    </Label>
               
            </Item>
            </Item.Group>
        </Segment>
        
        <Segment>
            <Item>
                    <Label color="teal">Opis: </Label>
                <Item.Description>
                    {post.content}
                </Item.Description>
            </Item>
        </Segment>
 

        <Segment>
            <Item>
                <Item.Extra>
                Postavljeno  {format(post.date, 'dd MMM yyyy h:mm aa')}
                </Item.Extra>
            </Item>
        </Segment>

        
        {accountStore.user?.username=== post.authorUsername ? (
        <Segment clearing>
            <Item>
                    <>
                    <Button floated="right" onClick={()=>deletePost(post.id)} color="red">Obriši post</Button>
                    <Button floated="right" as={Link} to={`/editPost/${post.id}`} primary>Izmeni post</Button>
                    </>
            </Item>
        </Segment>
                ): null}
        </Segment.Group>

        
           

               
    )
})