import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { router } from "../router/Router";
import { store } from "./store";
import { Profile } from "../domain/profile";

//////// STORE KOJA SADRZI FUNKCIJE ZA MANIPULACIJU SA DRUGIM KORISNICIMA, NE NAD TRENUTNO ULOGOVANIM

export default class ProfileStore {
  profile: Profile | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  loadProfile = async (username: string) => {
    try {
      var user = await agent.Profiles.loadProfile(username);
      runInAction(() => {
        this.profile = user;
      });
    } catch (error) {
      console.log(error);
    }
  };

  setAuthorAbout = async (username: string, requestData: string) => {
    try {
      await agent.Profiles.setAbout(username, requestData);
      runInAction(async () => {
        await store.profileStore.loadProfile(username);
        this.profile!.about = requestData;
        console.log(
          this.profile?.username,
          this.profile?.role,
          this.profile?.about
        );
      });
      console.log(this.profile);
    } catch (error) {
      console.log(error);
    }
  };

  deleteProfile = async (username: string) => {
    try {
      await agent.Profiles.delete(username);
      runInAction(() => {
        store.postStore.posts = store.postStore.posts.filter(
          (x) => x.authorUsername !== username
        );
        this.profile = null;
        router.navigate("/posts");
      });
    } catch (error) {
      console.log(error);
    }
  };

  promoteToAdministrator = async (username: string) => {
    try {
      await agent.Profiles.promoteToAdministrator(username);
      runInAction(() => {
        this.profile!.role = "Administrator";
      });
    } catch (error) {
      console.log(error);
    }
  };
}
