import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import PostItem from "./PostItem";
import profileStore from "../../../app/stores/profileStore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

interface Props {
  approvedList: boolean;
}

export default observer(function PostList({ approvedList }: Props) {
  const { username } = useParams();
  const { postStore, profileStore, accountStore, messageStore, commonStore } =
    useStore();
  useEffect(() => {
    if (username) profileStore.loadProfile(username);
  }, [profileStore]);
  return (
    <>
      {postStore.posts.map((post) =>
        post.approved === approvedList &&
        post.authorUsername === profileStore.profile?.username ? (
          <PostItem key={post.id} post={post} />
        ) : null
      )}
    </>
  );
});
