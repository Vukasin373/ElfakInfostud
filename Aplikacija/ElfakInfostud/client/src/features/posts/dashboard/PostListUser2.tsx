import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import PostItem from "./PostItem";
import profileStore from "../../../app/stores/profileStore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default observer(function PostListUser2() {
  const { username } = useParams();
  const { postStore, profileStore, accountStore, messageStore, commonStore } =
    useStore();
  useEffect(() => {
    if (username) {
      profileStore.loadProfile(username);
      postStore.vratiPostoveKorisnika(username!);
    }
  }, [username, postStore]);
  return (
    <>
      {postStore.postoviKorisnika.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </>
  );
});
