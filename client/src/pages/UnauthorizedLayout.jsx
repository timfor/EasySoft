import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "../App.css";
import "../styles/layout.css"; // хз надо или нет
import "../styles/auth.css";

import { ReactComponent as Robotimg } from "../images/robot-solid.svg";

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

            <NavLink to="/auth/login">
              <h3>Войти</h3>
            </NavLink>
            <NavLink to="/auth/register">
              <h3>Зарегистрироваться</h3>
            </NavLink>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
};

export default UnauthorizedLayout;
