import { action, makeAutoObservable, observable, runInAction } from "mobx";
import { User, UserForm } from "../domain/user";
import agent from "../api/agent";
import { store } from "./store";
import { router } from "../router/Router";
import { PagingParams } from "../domain/pagination";

export default class AccountStore {
  user: User | null = null;
  kafkaInitialized  = false;

  constructor() {
    makeAutoObservable(this, {
      user: observable,
      kafkaInitialized : observable,
      setUserImage: action,
    });
  }

  get isLoggedIn() {
    return !!this.user;
  }

  setUserImage = (image: string) => {
    this.user!.image = image;
  };

  postaviAbout = (about: string) => {
    this.user!.about = about;
    console.log(this.user!.about);
  };

  register = async (userForm: UserForm) => {
    try {
      /*  if (userForm.username) {
        var regex = /[^a-zA-Z0-9]/;
        if (regex.test(userForm.username)) {
          alert("Neispravno korisnicko ime!");
          return;
        }
      }*/
      const newUser = await agent.Account.register(userForm);
      store.commonStore.setToken(newUser.token);
      runInAction(() => {
        this.user = newUser;
      });
      router.navigate("/posts");
      store.modalStore.closeModal();
    } catch (error) {
      throw error;
    }
  };

  login = async (userForm: UserForm) => {
    try {
      const loggedUser = await agent.Account.login(userForm);
      store.commonStore.setToken(loggedUser.token);
      store.notificationStore.createHubConnection(loggedUser.username!);
      if(!this.kafkaInitialized)
        await agent.Posts.configKafkaForPosts(loggedUser.username);
      runInAction(() => {
        this.user = loggedUser;
       
      });
      if (window.location.pathname === "/") router.navigate("/posts");
      else window.location.reload();

      store.modalStore.closeModal();
    } catch (error) {
      throw error;
    }
  };

  getCurrentUser = async () => {
    try {
      console.log(store.notificationStore.notifications.length);
      const currentUser = await agent.Account.currentUser();
      console.log(currentUser.username);
      
      
      store.notificationStore.createHubConnection(currentUser.username);
      await agent.Posts.configKafkaForPosts(currentUser.username);
      runInAction(() => {
        this.user = currentUser;
        this.kafkaInitialized = true;
      });
    } catch (error) {
      console.log(error);
    }
  };

  logout = async () => {
    await agent.Posts.disconnectConsumersForPosts(this.user?.username!);
    runInAction(()=>{

      store.notificationStore.stopHubConnection();
      store.notificationStore.notifications = [];
      this.user = null;
      store.commonStore.setToken(null);
      router.navigate("/");
      //resetovanje postStore-a
      store.postStore.posts = [];
      store.postStore.postoviKorisnika = [];
      store.postStore.selectedPost = undefined;
      store.postStore.allowIncreaseNumberOfViews = true;
      store.postStore.initialLoadingApprovedPosts = true;
      store.postStore.initialLoadingNotApprovedPosts = true;
      store.postStore.initialLoadingUserPosts = true;
      store.postStore.initialLoadingUserPosts2 = true;
      store.postStore.changeViewForLikes = false;
      store.postStore.pagination = null;
      store.postStore.pagination2 = null;
      store.postStore.pagingParams = new PagingParams();
      store.postStore.pagingParams2 = new PagingParams();
      store.postStore.predicate = "svi";
      this.kafkaInitialized = false;
    })
    };
  }