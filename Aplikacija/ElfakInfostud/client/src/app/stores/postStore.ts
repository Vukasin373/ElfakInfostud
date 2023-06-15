import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Post, PostForm } from "../domain/post";
import agent from "../api/agent";
import { v4 as uuid } from "uuid";
import { store } from "./store";
import { router } from "../router/Router";
import {
  PaginatedResult,
  Pagination,
  PagingParams,
} from "../domain/pagination";

export default class PostStore {
  posts: Post[] = [];
  postoviKorisnika: Post[] = [];
  initialLoading = false;
  loading = false;
  selectedPost: Post | undefined = undefined;
  allowIncreaseNumberOfViews: boolean = true;
  initialLoadingApprovedPosts = true;
  initialLoadingNotApprovedPosts = true;
  initialLoadingUserPosts = true;
  initialLoadingUserPosts2 = true;
  changeViewForLikes = false;
  pagination: Pagination | null = null;
  pagination2: Pagination | null = null;
  pagingParams = new PagingParams();
  pagingParams2 = new PagingParams();
  predicate: string = "svi";
  loadPhoto = false;

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => this.predicate,
      () => {
        this.pagingParams = new PagingParams();
        this.posts = [];
        this.loadingPosts("true");
        this.initialLoadingNotApprovedPosts = true;
      }
    );
  }

  setPagingParams = (paginegParams: PagingParams) => {
    this.pagingParams = paginegParams;
  };

  setPagingParams2 = (paginegParams: PagingParams) => {
    this.pagingParams2 = paginegParams;
  };

  setPredicate = (predicate: string) => {
    this.predicate = predicate;
  };

  get axiossParams() {
    const params = new URLSearchParams();
    params.append("pageNumber", this.pagingParams.pageNumber.toString());
    params.append("pageSize", this.pagingParams.pageSize.toString());
    params.append("Kategorija", this.predicate.toString());
    return params;
  }

  get axiossParams2() {
    const params = new URLSearchParams();
    params.append("pageNumber", this.pagingParams2.pageNumber.toString());
    params.append("pageSize", this.pagingParams2.pageSize.toString());
    params.append("Kategorija", this.predicate.toString());
    return params;
  }

  loadingPosts = async (approved: string) => {
    try {
      var result: PaginatedResult<Post[]>;
      if (approved === "true")
        result = await agent.Posts.list(approved, this.axiossParams);
      else result = await agent.Posts.list(approved, this.axiossParams2);
      runInAction(() => {
        result.data.forEach((p) => {
          p.date = new Date(p.date);
          const post = new Post(p);
          this.posts.push(post);
        });
        if (approved === "true") this.setPagination(result.pagination);
        else this.setPagination2(result.pagination);
        if (approved === "true") this.initialLoadingApprovedPosts = false;
        else this.initialLoadingNotApprovedPosts = false;
      });
    } catch (error) {
      console.log(error);
    }
  };

  setPagination = (pagination: Pagination) => {
    this.pagination = pagination;
  };

  setPagination2 = (pagination: Pagination) => {
    this.pagination2 = pagination;
  };

  loadingPost = async (id: string) => {
    var post = this.posts.find((x) => x.id === id);
    var post2 = this.postoviKorisnika.find((x) => x.id === id);
    if (post) {
      this.selectedPost = post;
      console.log("ucitava post iz posts");
    } else if (post2) {
      this.selectedPost = post2;
      console.log("ucitava post iz postoviKorisnika");
    } else {
      try {
        post = await agent.Posts.details(id);
        post.date = new Date(post.date);
        //console.log(post);
        runInAction(() => {
          this.selectedPost = post;
          console.log("ucitava post iz baze");
        });
      } catch (error) {
        console.log(error);
      }
      //}
    }
  };

  vratiPostoveKorisnika = async (username: string) => {
    try {
      this.postoviKorisnika = [];
      var posts = await agent.Posts.listaPostovaKorisnika(username);
      runInAction(() => {
        posts.forEach((p) => {
          p.date = new Date(p.date);
          const post = new Post(p);
          this.postoviKorisnika.push(post);
        });
        if (username === store.accountStore.user?.username)
          this.initialLoadingUserPosts = false;
        else this.initialLoadingUserPosts = true;
      });
    } catch (error) {
      console.log(error);
    }
  };

  increaseNumberOfViews = async () => {
    try {
      await agent.Posts.updateNumberOfViews(this.selectedPost!.id);
      runInAction(() => {
        this.selectedPost!.numberOfViews++;
        const p = this.postoviKorisnika.find(
          (x) => x.id === this.selectedPost!.id
        );
        if (p) p.numberOfViews = this.selectedPost!.numberOfViews;
      });
    } catch (error) {
      console.log(error);
    }
  };

  createPost = async (post: PostForm) => {
    try {
      post.id = uuid();

      await agent.Posts.create(post);

      runInAction(() => {
        if (
          store.accountStore.user?.role === "User" &&
          this.initialLoadingNotApprovedPosts
        )
          return;

        if (!this.initialLoadingApprovedPosts) {
          const newPost = new Post(post);
          newPost.date = new Date();
          newPost.authorImage = store.accountStore.user!.image;
          newPost.authorUsername = store.accountStore.user!.username;
          if (store.accountStore.user?.role === "Administrator") {
            newPost.approved = true;
            const newPost2 = new Post(post);
            newPost2.date = new Date();
            newPost2.authorUsername = store.accountStore.user!.username;
            newPost2.approved = true;
            newPost2.authorImage = store.accountStore.user!.image;
            this.postoviKorisnika.unshift(newPost2);
          } else newPost.approved = false;

          this.posts.unshift(newPost);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  editPost = async (post: PostForm) => {
    try {
      await agent.Posts.edit(post);

      runInAction(() => {
        if (store.accountStore.user?.role === "User") {
          this.posts = this.posts.filter((x) => x.id !== post!.id);
        } else {
          var p = this.posts.find((x) => x.id === post.id);
          if (p) {
            p!.date = new Date();
            p!.title = post.title;
            p!.category = post.category;
            p!.content = post.content;
          }
        }
        if (store.accountStore.user?.role === "User") {
          this.postoviKorisnika = this.postoviKorisnika.filter(
            (x) => x.id !== post!.id
          );
        } else {
          var p = this.postoviKorisnika.find((x) => x.id === post.id);
          if (p) {
            p!.date = new Date();
            p!.title = post.title;
            p!.category = post.category;
            p!.content = post.content;
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  deletePost = async (id: string) => {
    try {
      await agent.Posts.delete(id);
      runInAction(() => {
        this.selectedPost = undefined;
        this.posts = this.posts.filter((x) => x.id !== id);
        if (this.postoviKorisnika)
          this.postoviKorisnika = this.postoviKorisnika.filter(
            (x) => x.id !== id
          );
      });
    } catch (error) {
      console.log(error);
    }
  };

  setIncreaseNumberOfViews = (allow: boolean) => {
    this.allowIncreaseNumberOfViews = allow;
  };

  acceptPost = async (id: string) => {
    try {
      await agent.Posts.acceptPost(id);
      runInAction(() => {
        var post = this.posts.find((x) => x.id === id);
        post!.approved = true;
        post!.date = new Date();
        this.posts = this.posts.filter((x) => x.id !== id);
        if (
          !this.initialLoadingApprovedPosts &&
          (post?.category === this.predicate || this.predicate === "svi")
        )
          this.posts.unshift(post!);
      });
    } catch (error) {
      console.log(error);
    }
  };

  changeAutorImage = (image: string) => {
    const { accountStore } = store;

    if (accountStore.user) {
      runInAction(() => {
        accountStore.setUserImage(image);
        console.log("uspeh");
        this.postoviKorisnika.forEach((p) =>
          runInAction(() => {
            p.authorImage = image;
          })
        );
        this.posts.forEach((p) =>
          runInAction(() => {
            if (p.authorUsername === accountStore.user?.username)
              p.authorImage = image;
          })
        );
      });
    }
    this.loadPhoto = !this.loadPhoto;
  };

  like = async (id: string) => {
    if (!store.commonStore.token) return;
    try {
      console.log("da");
      await agent.Posts.like(id);
      runInAction(() => {
        const post = this.posts.find((x) => x.id === id);
        if (post) {
          let like = post?.likes.find(
            (x) => x === store.accountStore.user?.username
          );
          console.log(post.likes);
          if (like)
            post.likes! = post?.likes.filter(
              (x) => x !== store.accountStore.user?.username
            );
          else post.likes.push(store.accountStore.user!.username);
          console.log(post.likes);
        }
        this.changeViewForLikes = !this.changeViewForLikes;
        const post2 = this.postoviKorisnika.find((x) => x.id === id);
        if (post2) {
          if (post) post2.likes = post!.likes;
          else {
            let like = post2?.likes.find(
              (x) => x === store.accountStore.user?.username
            );
            console.log(post2.likes);
            if (like)
              post2.likes = post2?.likes.filter(
                (x) => x !== store.accountStore.user?.username
              );
            else post2.likes.push(store.accountStore.user!.username);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
}
