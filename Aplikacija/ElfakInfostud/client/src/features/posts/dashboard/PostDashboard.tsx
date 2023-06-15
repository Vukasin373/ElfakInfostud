import { useEffect, useState } from "react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Grid, Button } from "semantic-ui-react";
import PostList from "./PostList";
import { NavLink } from "react-router-dom";
import { PagingParams } from "../../../app/domain/pagination";
import InfiniteScroll from "react-infinite-scroller";
import PostsFilter from "./PostsFilter";

export default observer(function PostDashboard() {
  const { commonStore } = useStore();
  const { postStore } = useStore();
  const [loadingNext, setLoadingNext] = useState(false);

  function handleGetNext() {
    setLoadingNext(true);
    postStore.setPagingParams(
      new PagingParams(postStore.pagination!.currentPage + 1)
    );
    postStore.loadingPosts("true").then(() => setLoadingNext(false));
  }

  useEffect(() => {
    if (postStore.initialLoadingApprovedPosts) {
      postStore.initialLoadingApprovedPosts = false;
      postStore.loadingPosts("true");
    }
  }, [postStore]);

  return (
    <div className="postovi-hero">
      {commonStore.token ? (
        <>
          <div className="forma-kreiranje-posta">
            <div className="tekst-file">
              Tražite cimera ili tim za projekat? Držite privatne časove ili
              prodajete knjige? Izgubili ste ili zaboravili nešto na fakultetu?
              Na pravom ste mestu. Kreirajte post i povežite se sa kolegama.
            </div>
            <Button
              positive
              content="Kreiraj post"
              as={NavLink}
              to="/createPost"
            />
          </div>
        </>
      ) : null}
      <PostsFilter />
      <InfiniteScroll
        pageStart={0}
        loadMore={handleGetNext}
        hasMore={
          !loadingNext &&
          !!postStore.pagination &&
          postStore.pagination.currentPage < postStore.pagination.totalPages
        }
        initialLoad={false}
      >
        <PostList approvedList={true} />
      </InfiniteScroll>

      {!loadingNext && (
        <div className="forma-kreiranje-posta nema-vise">
          <div className="tekst-file">
            Nema više postova. Došli ste do kraja!
          </div>
        </div>
      )}
    </div>
  );
});
