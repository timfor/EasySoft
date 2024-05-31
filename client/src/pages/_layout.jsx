import React from "react";
import { NavLink, Outlet } from "react-router-dom";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "../App.css";
import "../styles/layout.css";

// import logo from '../images/logo.png'
// import outlawer1 from '../images/outlawer1.png'
// import outlawer2 from '../images/outlawer2.png'

import { ReactComponent as Robotimg } from "../images/robot-solid.svg";
import { ReactComponent as Profileimg } from "../images/user-regular.svg";
import { ReactComponent as Settingsimg } from "../images/gear-solid.svg";

const Layout = () => {
  return (
    <>
      <header>
        <div className="container">
          <NavLink className="header-left" to="/">
            <Robotimg width={70} />
            <h2>AutoSoft</h2>
          </NavLink>

          <div className="header-right">
            <NavLink to="/faq">
              <h3>FAQ</h3>
            </NavLink>
            <NavLink to="/softs">
              <h3>Программы</h3>
            </NavLink>

            <NavLink to="/cart">
              <h3>Корзина</h3>
            </NavLink>

            <NavLink to="/profile">
              <Profileimg width={27} />
            </NavLink>
            <NavLink to="/settings">
              <Settingsimg width={30} />
            </NavLink>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <div className="container">
          <p>made by tmcrypted</p>

          <div>
            <NavLink to="/contacts">Контакты</NavLink>
            <NavLink to="/contacts">Сотрудничество</NavLink>
            <NavLink to="/contacts">Поддержка</NavLink>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Layout;
