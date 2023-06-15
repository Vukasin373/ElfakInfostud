import { Button, Container } from "semantic-ui-react";
import PostDashboard from "../../features/posts/dashboard/PostDashboard";
import NavigationBar from "./NavigationBar";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { store, useStore } from "../stores/store";
import HomePage from "../../features/home/HomePage";
import ModalContainer from "../common/modals/ModalContainer";
import LoadingComponent from "./LoadingComponent";
import { observer } from "mobx-react-lite";

function App() {
  const location = useLocation();
  const { commonStore, accountStore } = useStore();

  useEffect(() => {
    if (commonStore.token)
      accountStore.getCurrentUser().finally(() => commonStore.setAppLoaded());
    else commonStore.setAppLoaded();
  }, [commonStore, accountStore]);

  if (!commonStore.appLoaded) return <LoadingComponent />;

  return (
    <>
      <ScrollRestoration />
      <ModalContainer />
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      {location.pathname === "/" ? (
        <HomePage />
      ) : (
        <>
          <NavigationBar />
          <Container style={{ marginTop: "7em" }}>
            <Outlet />
          </Container>
        </>
      )}
    </>
  );
}

export default observer(App);
