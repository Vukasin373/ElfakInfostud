import axios, { AxiosError, AxiosResponse } from "axios";
import { Post, PostForm } from "../domain/post";
import { router } from "../router/Router";
import { toast } from "react-toastify";
import { stat } from "fs";
import { store } from "../stores/store";
import { User, UserForm } from "../domain/user";
import { config } from "process";
import { Profile } from "../domain/profile";
import ChatPartner from "../../features/chat/chatPartner";
import { PaginatedResult } from "../domain/pagination";

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

axios.defaults.baseURL = "http://localhost:5293/api/";

axios.interceptors.request.use((config) => {
  const token = store.commonStore.token;
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  async (response) => {
    //await sleep(1000);
    const pagination = response.headers["pagination"];
    if (pagination) {
      response.data = new PaginatedResult(
        response.data,
        JSON.parse(pagination)
      );
      return response as AxiosResponse<PaginatedResult<any>>;
    }
    return response;
  },
  (error: AxiosError) => {
    const { data, status, config } = error.response as AxiosResponse;
    if (status == 400) {
      if (config.method === "get" && data.errors.hasOwnProperty("id"))
        router.navigate("/notFound");
      if (data.errors) {
        const modalStateErrors = [];
        for (const key in data.errors) {
          if (data.errors[key]) modalStateErrors.push(data.errors[key]);
        }
        throw modalStateErrors.flat();
      }
    } else if (status === 401) {
      toast.error("Unauthorised");
    } else if (status === 403) {
      toast.error("Forbidden");
    } else if (status === 404) {
      router.navigate("/notFound");
    } else if (status === 500) {
      store.commonStore.setServerError(data);
      router.navigate("/serverError");
    }
    return Promise.reject(error);
  }
);

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) =>
    axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Posts = {
  list: (approved: string, params: URLSearchParams) =>
    axios
      .get<PaginatedResult<Post[]>>(`/posts/?approved=${approved}`, { params })
      .then(responseBody),
  details: (id: string) => requests.get<Post>(`/posts/${id}`),
  create: (post: PostForm) => requests.post<void>("/posts/createPost", post),
  edit: (post: PostForm) =>
    requests.put<void>(`posts/editPost/${post.id}`, post),
  delete: (id: string) => requests.delete<void>(`/posts/${id}`),
  updateNumberOfViews: (id: string) => requests.put<void>(`/posts/${id}`, {}),
  acceptPost: (id: string) => requests.put<void>(`/posts/acceptPost/${id}`, {}),
  like: (id: string) => requests.post<void>(`/posts/like/${id}`, {}),
  listaPostovaKorisnika: (username: string) =>
    requests.get<Post[]>(`/posts/postoviKorisnika/?username=${username}`),
    configKafkaForPosts: (username: string) => requests.put<void>(`/posts/configKafkaForPosts/${username}`,{} ),
    disconnectConsumersForPosts: (username: string) => requests.put<void>(`/posts/disconnectConsumersForPosts/${username}`,{} ),
    disconnectConsumerForSpecificPost: (username: string, specificPostId: string) => requests.put<void>(`/posts/disconnectConsumerForSpecificPost/${username}/${specificPostId}`,{} ),
  };

const Account = {
  register: (user: UserForm) => requests.post<User>("/account/register/", user),
  login: (user: UserForm) => requests.post<User>("/account/login/", user),
  currentUser: () => requests.get<User>("/account"),
 
};

const Profiles = {
  loadProfile: (username: string) =>
    requests.get<Profile>(`/profiles/${username}`),
  delete: (username: string) => requests.delete<void>(`/profiles/${username}`),
  promoteToAdministrator: (username: string) =>
    requests.put<void>(`/profiles/${username}`, {}),
  setAbout: (username: string, about: string) => {
    requests.put<void>(`/profiles/setAbout/${username}/${about}`, {});
  },
};

const Messages = {
  getChatName: (username1: string, username2: string) =>
    requests.get<string>(`/message?user1=${username1}&user2=${username2}`),
  getAllChatPartners: () => requests.get<ChatPartner[]>("/message/inbox"),
  delete: (id: number) => requests.delete<void>("/message/delete"),
  readMessage: (id: number) =>
    requests.put<void>(`/message/readMessage/${id}`, {}),
  readAllMessages: (username: string) =>
    requests.put<number>(`/message/readAllMessages/${username}`, {}),
  checkForNewMessage: () => requests.get<number>("/message/checkForNewMessage"),
};

const Notifications = {
  readAllNotifications: (username: string,newNumOfViewedNotifications: number ) =>
  requests.put<void>(`/notification?username=${username}&newNumOfViewedNotifications=${newNumOfViewedNotifications}`, {}),
}

const agent = {
  Posts,
  Account,
  Profiles,
  Messages,
  Notifications
};

export default agent;