import { observer } from "mobx-react-lite";
import { Post } from "../../../app/domain/post";
import {
  Button,
  Icon,
  Item,
  ItemDescription,
  Label,
  Segment,
  Statistic,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import { format } from "date-fns";
import { router } from "../../../app/router/Router";
import { useEffect } from "react";

interface Props {
  post: Post;
}
export default observer(function PostItem({ post }: Props) {
  const { postStore, accountStore, messageStore, commonStore } = useStore();

  useEffect(() => {}, [postStore.changeViewForLikes, postStore.loadPhoto]);
  function truncate(content: string) {
    if (content)
      return content.length > 180 ? content.substring(0, 179) + "..." : content;
  }

  function openChat() {
    messageStore.getChatName(post.authorUsername!).then(() => {
      router.navigate(`/chat/${post.authorUsername}/${messageStore.chatName}`);
    });
  }

  return (
    <Segment.Group className="post-u-listi">
      <Segment>
        <Item.Group>
          <Item className="post-zaglavlje">
            <Item.Image
              className="post-zaglavlje-slika"
              size="tiny"
              circular
              src={
                post.authorImage
                  ? `data:image/jpeg;base64,${post.authorImage}`
                  : "/user.png"
              }
            />
            <Item.Content className="post-zaglavlje-sadrzaj">
              <Item.Header as="h2">{post.title}</Item.Header>
              <Item.Description>
                <h3>@{post.authorUsername}</h3>
              </Item.Description>
              <Item.Description className="post-zaglavlje-kategorija">
                <Label>{post.category}</Label>
              </Item.Description>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>

      <Segment>
        <Item>
          <Item.Description>
            {post.approved ? truncate(post.content) : post.content}
          </Item.Description>
          <div className="post-datum">
            <Icon name="clock" /> {format(post.date, "dd MMM yyyy h:mm aa")}
          </div>
        </Item>
      </Segment>
      <Segment clearing>
        <Item>
          {post.approved ? (
            <>
              <div className="post-dno">
                <div className="post-dno-levo">
                  <span className="pregledi-broj">{post.numberOfViews}</span>{" "}
                  {post.numberOfViews === 1 ? "PREGLED" : "PREGLEDA"}
                </div>
                <div className="post-dno-desno">
                  <Button
                    className="vidi-jos"
                    as={Link}
                    to={`/posts/${post.id}`}
                    hover="true"
                    primary
                    onClick={() => postStore.setIncreaseNumberOfViews(true)}
                  >
                    Vidi još
                  </Button>

                  {post.approved &&
                  post.authorUsername !== accountStore.user?.username &&
                  commonStore.token ? (
                    <Button
                      className="kontaktiraj-autora"
                      onClick={openChat}
                      content="Kontaktiraj autora"
                      color="blue"
                    />
                  ) : null}
                  <div className="ui labeled button lajk-dugme">
                    {commonStore.token ? (
                      <div onClick={() => postStore.like(post.id)}>
                        {" "}
                        {post.likes.find(
                          (x) => x === accountStore.user!.username
                        ) ? (
                          <i className="heart icon"></i>
                        ) : (
                          <i className="heart outline icon"></i>
                        )}
                      </div>
                    ) : (
                      <i className="heart outline  icon"></i>
                    )}
                    <a className="broj-lajkova">
                      {post.likes.length} {post.likes.length === 1 ? " " : " "}
                    </a>
                  </div>
                </div>
              </div>
            </>
          ) : null}
          {!post.approved ? (
            <>
              <Button
                color="red"
                floated="right"
                content="Odbaci post"
                onClick={() => postStore.deletePost(post.id)}
              />
              <Button
                color="green"
                floated="right"
                content="Prihvati post"
                onClick={() => postStore.acceptPost(post.id)}
              />
            </>
          ) : null}
        </Item>
      </Segment>
    </Segment.Group>
  );
});
