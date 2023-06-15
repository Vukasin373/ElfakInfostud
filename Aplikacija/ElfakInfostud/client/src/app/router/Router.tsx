import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import PostDashboard from "../../features/posts/dashboard/PostDashboard";
import App from "../layout/App";
import PostDetails from "../../features/posts/details/PostDetails";
import FormPost from "../../features/posts/forms/FormPost";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";
import LoginForm from "../../features/users/LoginForm";
import RegisterForm from "../../features/users/RegisterForm";
import NotificationsPostDashboard from "../../features/posts/dashboard/NotificationsPostDashboard";
import MaterijaliDashboard from "../../features/materijali/MaterijaliDashboard";
import Profile from "../../features/profiles/Profile";
import ChatPage from "../../features/chat/ChatPage";
import MyProfile from "../../features/profiles/MyProfile";
import Inbox from "../../features/chat/Inbox";
import RequireAuth from "./RequireAuth";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <RequireAuth />,
        children: [
          { path: "createPost/", element: <FormPost key="create" /> },
          { path: "editPost/:id", element: <FormPost key="edit" /> },
          { path: "notifications", element: <NotificationsPostDashboard /> },
          { path: "myProfile", element: <MyProfile /> },
          { path: "chat/:username/:chatName", element: <ChatPage /> },
          { path: "inbox", element: <Inbox /> },
        ],
      },
      { path: "profile/:username", element: <Profile /> },
      { path: "materijali", element: <MaterijaliDashboard /> },
      { path: "posts/:id", element: <PostDetails /> },
      { path: "posts", element: <PostDashboard /> },
      { path: "loginForm", element: <LoginForm /> },
      { path: "registerForm", element: <RegisterForm /> },
      // {path:'materials', element: <MaterialDashboard/>}
      // {path:'materials:/id', element: <MaterialDetails/>}
      { path: "notFound", element: <NotFound /> },
      { path: "serverError", element: <ServerError /> },
      { path: "*", element: <Navigate replace to="/NotFound" /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
