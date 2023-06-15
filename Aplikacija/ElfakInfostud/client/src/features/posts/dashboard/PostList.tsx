import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import PostItem from "./PostItem";

interface Props {
  approvedList: boolean;
}

export default observer(function PostList({ approvedList }: Props) {
  const { postStore } = useStore();

  return (
    <>
      {postStore.posts.map((post) =>
        post.approved === approvedList ? (
          <PostItem key={post.id} post={post} />
        ) : null
      )}
    </>
  );
});
