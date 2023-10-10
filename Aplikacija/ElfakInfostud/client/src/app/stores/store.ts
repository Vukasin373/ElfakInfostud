import { createContext, useContext } from "react";
import PostStore from "./postStore";
import CommonStore from "./commonStore";
import AccountStore from "./accountStore";
import ModalStore from "./modalStore";
import CommentStore from "./commentStore";
import ProfileStore from "./profileStore";
import MessageStore from "./messageStore";
import NotificationStore from "./notificationStore";

interface Store {
  postStore: PostStore;
  commonStore: CommonStore;
  accountStore: AccountStore;
  profileStore: ProfileStore;
  modalStore: ModalStore;
  commentStore : CommentStore,
  messageStore : MessageStore,
  notificationStore : NotificationStore
}

export const store: Store = {
  postStore: new PostStore(),
  commonStore: new CommonStore(),
  accountStore: new AccountStore(),
  profileStore: new ProfileStore(),
  modalStore: new ModalStore(),
  commentStore : new CommentStore(),
  messageStore : new MessageStore(),
  notificationStore : new NotificationStore()
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
