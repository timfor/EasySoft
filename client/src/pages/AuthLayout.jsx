import React from "react";
import { NavLink, Outlet } from "react-router-dom";

import "../App.css";
import "../styles/layout.css";

import { ReactComponent as Robotimg } from "../images/robot-solid.svg";
import { ReactComponent as Profileimg } from "../images/user-regular.svg";
import { ReactComponent as Settingsimg } from "../images/gear-solid.svg";
import { ReactComponent as LogoutImg } from "../images/logout.svg";
import { ReactComponent as CartImg } from "../images/cart.svg";

import { useAuthStore } from "../AppStateContext.js";
import useCartStore from "../context/CartStore.js";

const LayoutAuth = () => {
  const { logout, data } = useAuthStore();
  const { cart, clearCart } = useCartStore();

  const handleLogout = () => {
    clearCart();
    logout();
    // После выхода можно перенаправить пользователя на главную страницу или страницу входа
    // Используйте библиотеку react-router-dom для навигации, если необходимо
    // navigate('/auth');
  };

  return (
    <>
      <header>
        <div className="container">
          <NavLink className="header-left" to="/">
            <Robotimg width={70} />
            <h2>AutoSoft</h2>
          </NavLink>

          <div className="header-right">
            <NavLink to="/contacts">
              <h3>Контакты</h3>
            </NavLink>

            <NavLink to="/softs">
              <h3>Каталог</h3>
            </NavLink>

            {data.roleId >= 2 ? (
              <>
                <NavLink to="/admin">
                  <h3>Админ панель</h3>
                </NavLink>
              </>
            ) : null}

            <NavLink to="/cart" id="cartNavLink">
              <CartImg width={33} />
              {cart.length === 0 ? (
                <></>
              ) : (
                <div id="badgeCart">{cart.length}</div>
              )}
            </NavLink>
            <NavLink to="/profile">
              <Profileimg width={27} />
            </NavLink>

            <NavLink to="/auth" onClick={handleLogout}>
              <LogoutImg width={31} />
            </NavLink>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <div className="container">
          <p>
            made by
            <a id="tmcrypted" target="_blank" href="https://linktr.ee/timfor">
              tmcrypted
            </a>
          </p>

          <div>
            <NavLink to="/contacts">Контакты</NavLink>
          </div>
        </div>
      </footer>
    </>
  );
};

export default LayoutAuth;
