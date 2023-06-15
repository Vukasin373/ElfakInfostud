import { observer } from "mobx-react-lite";
import { Button, Grid, Header } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { useEffect, useState } from "react";
import PostList from "./PostList";
import { PagingParams } from "../../../app/domain/pagination";
import InfiniteScroll from "react-infinite-scroller";

export default observer(function NotificationsPostDashboard() {
  const { postStore } = useStore();
  const [loadingNext, setLoadingNext] = useState(false);
  const {
    postStore: { pagingParams, setPagingParams },
  } = useStore();

  function handleGetNext() {
    setLoadingNext(true);
    postStore.setPagingParams2(
      new PagingParams(postStore.pagination2!.currentPage + 1)
    );
    postStore.loadingPosts("false").then(() => setLoadingNext(false));
  }

  useEffect(() => {
    if (postStore.initialLoadingNotApprovedPosts) {
      postStore.initialLoadingNotApprovedPosts = false;
      postStore.setPagingParams2(new PagingParams());
      postStore.loadingPosts("false");
    }
  }, [postStore]);
  return (
    <div className="postovi-hero">
      {postStore.posts.find((x) => x.approved === false) ? null : (
        <div className="forma-kreiranje-posta nema-vise">
          <div className="tekst-file">
            Nema postova koji čekaju na odobrenje.
          </div>
        </div>
      )}
      <InfiniteScroll
        pageStart={0}
        loadMore={handleGetNext}
        hasMore={
          !loadingNext &&
          !!postStore.pagination2 &&
          postStore.pagination2.currentPage < postStore.pagination2.totalPages
        }
        initialLoad={false}
      >
        <PostList approvedList={false} />
      </InfiniteScroll>
    </div>
  );
});
