import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import "../App.css";
import "../styles/layout.css"; // хз надо или нет
import "../styles/auth.css";

import { ReactComponent as Robotimg } from "../images/robot-solid.svg";
import { ReactComponent as Profileimg } from "../images/user-regular.svg";

const UnauthorizedLayout = () => {
  return (
    <>
      <header>
        <div className="container">
          <NavLink className="header-left" to="/">
            <Robotimg width={70} />
            <h2>AutoSoft</h2>
          </NavLink>

          <div className="header-right">
            <NavLink to="/softs">
              <h3>Программы</h3>
            </NavLink>

            <NavLink to="/auth">
              <Profileimg width={27} />
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

export default UnauthorizedLayout;
