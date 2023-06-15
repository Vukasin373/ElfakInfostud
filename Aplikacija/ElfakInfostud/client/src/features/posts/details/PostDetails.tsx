import { observer } from "mobx-react-lite";
import { format } from "date-fns";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Grid,
  GridColumn,
  Header,
  Icon,
  Item,
  Label,
  Segment,
} from "semantic-ui-react";
import { Post } from "../../../app/domain/post";
import { useStore } from "../../../app/stores/store";
import { useEffect } from "react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import PostMainInfo from "./PostMainInfo";
import PostChat from "./PostChat";
import { router } from "../../../app/router/Router";
import { access } from "fs";

export default observer(function PostDetails() {
  const { postStore, accountStore, messageStore, commonStore } = useStore();
  useEffect(() => {}, [postStore.changeViewForLikes]);

  const navigate = useNavigate();

  function deletePost(id: string) {
    postStore.deletePost(id).then(() => navigate("/posts"));
  }

  const { id } = useParams();
  useEffect(() => {
    if (id)
      postStore.loadingPost(id).then(() => {
        if (
          postStore.allowIncreaseNumberOfViews &&
          postStore.selectedPost?.approved
        ) {
          postStore.increaseNumberOfViews().then(() => {
            postStore.setIncreaseNumberOfViews(false);
          });
        }
      });
  }, [postStore, id]);

  if (!postStore.selectedPost) return <LoadingComponent />;
  function openChat() {
    messageStore
      .getChatName(postStore.selectedPost?.authorUsername!)
      .then(() => {
        router.navigate(
          `/chat/${postStore.selectedPost?.authorUsername}/${messageStore.chatName}`
        );
      });
  }
  return (
    <div className="postovi-hero">
      <Segment.Group className="post-u-listi">
        <Segment>
          <Item.Group>
            <Item className="post-zaglavlje">
              <Item.Image
                as={Link}
                to={
                  postStore.selectedPost.authorUsername !==
                  accountStore.user?.username
                    ? `/profile/${postStore.selectedPost.authorUsername}`
                    : `/MyProfile`
                }
                className="post-zaglavlje-slika"
                size="tiny"
                circular
                src={
                  postStore.selectedPost.authorImage
                    ? `data:image/jpeg;base64,${postStore.selectedPost.authorImage}`
                    : "/user.png"
                }
              />
              <Item.Content className="post-zaglavlje-sadrzaj">
                <Item.Header as="h2">
                  {postStore.selectedPost.title}
                </Item.Header>
                <Item.Description>
                  <h3>@{postStore.selectedPost.authorUsername}</h3>
                </Item.Description>
                <Item.Description className="post-zaglavlje-kategorija">
                  <Label>{postStore.selectedPost.category}</Label>
                </Item.Description>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>

        <Segment>
          <Item>
            <Item.Description>
              {postStore.selectedPost.content}
            </Item.Description>
            <div className="post-datum">
              <Icon name="clock" />{" "}
              {format(postStore.selectedPost.date, "dd MMM yyyy h:mm aa")}
            </div>
          </Item>
        </Segment>
        <Segment clearing>
          <Item>
            {postStore.selectedPost.approved ? (
              <>
                <div className="post-dno">
                  <div className="post-dno-levo">
                    <span className="pregledi-broj">
                      {postStore.selectedPost.numberOfViews + 1}
                    </span>{" "}
                    {postStore.selectedPost.numberOfViews === 0
                      ? "PREGLED"
                      : "PREGLEDA"}
                  </div>
                  <div className="post-dno-desno">
                    {postStore.selectedPost.approved &&
                    postStore.selectedPost.authorUsername !==
                      accountStore.user?.username &&
                    commonStore.token ? (
                      <>
                        {postStore.selectedPost.authorUsername !==
                          accountStore.user?.username && (
                          <Button
                            as={Link}
                            to={`/profile/${postStore.selectedPost.authorUsername}`}
                            icon="user"
                            floated="right"
                            color="teal"
                            content="Vidi profil autora"
                          />
                        )}
                        <Button
                          className="kontaktiraj-autora"
                          onClick={openChat}
                          content="Kontaktiraj autora"
                          color="blue"
                        />
                      </>
                    ) : null}
                    {accountStore.user?.username ===
                    postStore.selectedPost.authorUsername ? (
                      <>
                        <Button
                          className="obrisi-klasa"
                          floated="right"
                          onClick={() => deletePost(postStore.selectedPost!.id)}
                          color="red"
                        >
                          Obriši post
                        </Button>
                        <Button
                          className="izmeni-klasa"
                          floated="right"
                          as={Link}
                          to={`/editPost/${postStore.selectedPost.id}`}
                          primary
                        >
                          Izmeni post
                        </Button>
                      </>
                    ) : null}
                  </div>
                </div>
              </>
            ) : null}
            {!postStore.selectedPost.approved ? (
              <Button
                color="red"
                floated="right"
                content="Odbaci post"
                onClick={() => postStore.deletePost(postStore.selectedPost!.id)}
              />
            ) : null}

            {!postStore.selectedPost.approved ? (
              <Button
                color="green"
                floated="right"
                content="Prihvati post"
                onClick={() => postStore.acceptPost(postStore.selectedPost!.id)}
              />
            ) : null}
          </Item>
        </Segment>
      </Segment.Group>

      {postStore.selectedPost.approved ? (
        <PostChat postId={postStore.selectedPost.id} />
      ) : null}
    </div>
  );
});
