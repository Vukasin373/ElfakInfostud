import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Container,
  Header,
  Segment,
  Image,
  MenuItem,
} from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import LoginForm from "../users/LoginForm";
import RegisterForm from "../users/RegisterForm";

export default observer(function HomePage() {
  const { profileStore, modalStore } = useStore();
  const { commonStore, accountStore } = useStore();

  function otvoriBurger(): any {
    let burgerMenu = document.querySelector(".burger-menu-list-h");
    console.log(burgerMenu);
    burgerMenu?.classList.add("vidljiv2");
  }

  function zatvoriBurger(): any {
    let burgerMenu = document.querySelector(".burger-menu-list-h");
    console.log(burgerMenu);
    burgerMenu?.classList.remove("vidljiv2");
  }

  return (
    <>
      <nav className="nav-h">
        <h2 className="h2-h">ElfakInfostud</h2>

        <ul className="ul-h">
          <li className="burger-menu-h">
            <MenuItem
              onClick={() => {
                otvoriBurger();
              }}
            >
              <i className="sidebar icon"></i>
            </MenuItem>
          </li>
          {!commonStore.token ? (
            <>
              <li className="slobodan-pristup li-h">
                <a className="a-h" href="/posts">
                  Slobodan pristup
                </a>
              </li>
              <li
                className="login li-h"
                onClick={() => modalStore.openModal(<LoginForm />)}
              >
                Prijavi se
              </li>
              <li
                className="registration li-h"
                onClick={() => modalStore.openModal(<RegisterForm />)}
              >
                Registruj se
              </li>
            </>
          ) : (
            <>
              <li className="li-h vrati-se-na-pocetnu">
                <a className="a-h" href="/posts">
                  Vrati se na početnu
                </a>
              </li>
              <li className="li-h odjavi-se">
                <a className="a-h" onClick={() => accountStore.logout()}>
                  Odjavi se
                </a>
              </li>
            </>
          )}
        </ul>
      </nav>
      <div className="burger-menu-list-h">
        <ul>
          {!commonStore.token ? (
            <>
              <li className="slobodan-pristup-burger">
                <a href="/posts">Slobodan pristup</a>
              </li>
              <li
                className="login-burger"
                onClick={() => modalStore.openModal(<LoginForm />)}
              >
                Prijavi se
              </li>
              <li
                className="registration-burger"
                onClick={() => modalStore.openModal(<RegisterForm />)}
              >
                Registruj se
              </li>
            </>
          ) : (
            <>
              <li className="vrati-se-na-pocetnu-burger">
                <a href="/posts">Vrati se na početnu</a>
              </li>
              <li className="odjavi-se-burger">
                <a onClick={() => accountStore.logout()}>Odjavi se</a>
              </li>
            </>
          )}

          <div
            className="zatvori-burger-h"
            onClick={() => {
              zatvoriBurger();
            }}
          >
            X
          </div>
        </ul>
      </div>
      <div className="hero">
        <div className="left-h">
          <div className="tekst-h">
            <h1 className="h1-h">ElfakInfostud</h1>
            <p className="new-p-h">
              Dobrodošli na platformu namenjenu studentima Elektronskog
              fakulteta
            </p>

            <div className="dugmici-h">
              {commonStore.token ? (
                <a className="a-h" href="/posts">
                  <button className="button-b button-back">
                    Vrati se na početnu
                  </button>
                </a>
              ) : (
                <>
                  <button
                    onClick={() => modalStore.openModal(<LoginForm />)}
                    className="button-b button-login"
                  >
                    Prijavi se
                  </button>
                  <button
                    onClick={() => modalStore.openModal(<RegisterForm />)}
                    className="button-b button-register"
                  >
                    Registruj se
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="right-h"></div>
      </div>
    </>
  );
});
