import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";

import "../App.css";
import "../styles/layout.css";

import Robotimg from "../images/logo2.png";
import { ReactComponent as Profileimg } from "../images/user-regular.svg";
import { ReactComponent as Settingsimg } from "../images/gear-solid.svg";
import { ReactComponent as LogoutImg } from "../images/logout.svg";
import { ReactComponent as CartImg } from "../images/cart.svg";

import { useAuthStore } from "../AppStateContext.js";
import useCartStore from "../context/CartStore.js";

const LayoutAuth = () => {
  const { logout, data } = useAuthStore();
  const { cart, clearCart } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchInput, setSearchInput] = useState();

  const handleLogout = () => {
    clearCart();
    logout();
  };

  useEffect(() => {
    setSearchInput("");
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/softs?search=${encodeURIComponent(searchInput)}`);
    setSearchInput("");
  };

  return (
    <>
      <header>
        <div className="container">
          <NavLink className="header-left" to="/">
            <img src={Robotimg} alt="" />
          </NavLink>

          <form className="search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Поиск товаров..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit">Искать</button>
          </form>

          <div className="header-right">
            <NavLink to="/contacts">
              <h3>Контакты</h3>
            </NavLink>

            <NavLink to="/softs">
              <h3>Каталог</h3>
            </NavLink>

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
