import { observer } from "mobx-react-lite";
import { Link, NavLink } from "react-router-dom";
import { Button, Icon, Menu, MenuItem } from "semantic-ui-react";
import { store, useStore } from "../stores/store";
import { router } from "../router/Router";
import modalStore from "../stores/modalStore";
import LoginForm from "../../features/users/LoginForm";
import { useEffect } from "react";

export default observer(function NavigationBar() {
  const { commonStore, accountStore, modalStore, messageStore } = useStore();

  useEffect(() => {
    commonStore.token && messageStore.checkForNewMessage();
  }, [messageStore.numberOfUnseenMessages]);

  function otvoriBurger(): any {
    let burgerMenu = document.querySelector(".burger-menu-list");
    burgerMenu?.classList.add("vidljiv");
  }

  function zatvoriBurger(): any {
    let burgerMenu = document.querySelector(".burger-menu-list");
    burgerMenu?.classList.remove("vidljiv");
  }

  return (
    <Menu inverted size="large" fixed="top">
      <div className="menu-main">
        <div className="menu-left">
          <Menu.Item as={NavLink} to="/" header>
            ElfakInfostud
          </Menu.Item>
          <Menu.Item
            className="postovi-menu"
            name="Postovi"
            as={NavLink}
            to="/posts"
          />
          <Menu.Item
            className="materijali-menu"
            as={NavLink}
            to="/materijali"
            name="Materijali"
          />

          {accountStore.user?.role === "Administrator" ? (
            <Menu.Item
              className="administrator-menu"
              name="Administrator"
              as={NavLink}
              to="/notifications"
            />
          ) : null}
        </div>

        <div className="menu-right">
          <MenuItem
            className="burger-menu"
            onClick={() => {
              otvoriBurger();
            }}
          >
            <i className="sidebar icon"></i>
          </MenuItem>

          {commonStore.token ? (
            <Menu.Item
              className="inbox-menu"
              position="left"
              as={NavLink}
              to="/notificationsForPosts"
              onClick={()=> store.notificationStore.unreadNotificationsCount> 0 && store.notificationStore.readAllNotifications(accountStore.user?.username!)}
            >
              <Icon name="commenting" />
              Notifications&nbsp;
              {store.notificationStore.unreadNotificationsCount > 0 && (
                <span style={{ color: "red" }}>
                  {store.notificationStore.unreadNotificationsCount}
                </span>
              )}
            </Menu.Item>
          ) : null}

          {commonStore.token ? (
            <Menu.Item
              className="inbox-menu"
              position="left"
              as={NavLink}
              to="/inbox"
            >
              <Icon name="inbox" />
              Inbox&nbsp;
              {messageStore.numberOfUnseenMessages > 0 && (
                <span style={{ color: "red" }}>
                  {messageStore.numberOfUnseenMessages}
                </span>
              )}
            </Menu.Item>
          ) : null}
          {commonStore.token ? (
            <Menu.Item
              className="mojProfil-menu"
              position="right"
              name="Moj profil"
              as={NavLink}
              to={"/MyProfile"}
            />
          ) : null}

          <Menu.Item className="dugme-menu">
            {!commonStore.token ? (
              <Button
                primary
                className="zeleno-dugme"
                content="Prijavi se"
                onClick={() => modalStore.openModal(<LoginForm />)}
              />
            ) : (
              <Button
                primary
                className="sivo-dugme"
                content="Odjavi se"
                onClick={() => accountStore.logout()}
              />
            )}
          </Menu.Item>
        </div>
      </div>
      <div className="burger-menu-list">
        <Menu.Item name="Postovi" as={NavLink} to="/posts" />
        <Menu.Item as={NavLink} to="/materijali" name="Materijali" />

        {accountStore.user?.role === "Administrator" ? (
          <Menu.Item name="Administrator" as={NavLink} to="/notifications" />
        ) : null}

        {commonStore.token ? (
          <Menu.Item as={NavLink} to="/inbox">
            <Icon name="inbox" />
            Inbox&nbsp;
            {messageStore.numberOfUnseenMessages > 0 && (
              <span style={{ color: "red" }}>
                {messageStore.numberOfUnseenMessages}
              </span>
            )}
          </Menu.Item>
        ) : null}

        {commonStore.token ? (
          <Menu.Item name="Moj profil" as={NavLink} to={"/MyProfile"} />
        ) : null}

        {!commonStore.token ? (
          <Menu.Item
            content="Prijavi se"
            onClick={() => modalStore.openModal(<LoginForm />)}
          />
        ) : (
          <Menu.Item
            content="Odjavi se"
            onClick={() => accountStore.logout()}
          />
        )}
        <Menu.Item
          name="izadji"
          content="X"
          onClick={() => {
            zatvoriBurger();
          }}
        />
      </div>
    </Menu>
  );
});
