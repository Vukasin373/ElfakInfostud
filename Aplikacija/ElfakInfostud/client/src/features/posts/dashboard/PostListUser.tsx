import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import PostItem from "./PostItem";
import { useEffect } from "react";
import ProfileStore from "../../../app/stores/profileStore";
import LoadingComponent from "../../../app/layout/LoadingComponent";

export default observer(function PostListUser() {
  const { postStore } = useStore();
  const { accountStore } = useStore();
  useEffect(() => {
    if (postStore.initialLoadingUserPosts) {
      postStore.vratiPostoveKorisnika(accountStore.user!.username);
    }
  }, [postStore]);

  if (postStore.initialLoadingUserPosts) return <LoadingComponent />;

  return (
    <>
      {postStore.postoviKorisnika.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </>
  );
});
