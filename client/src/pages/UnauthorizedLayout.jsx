import React from "react";
import { NavLink, Outlet, Navigate } from "react-router-dom";
import "../App.css";
import "../styles/layout.css"; // хз надо или нет
import "../styles/auth.css";

import { ReactComponent as Robotimg } from "../images/robot-solid.svg";

const UnauthorizedLayout = () => {
  return (
    <>
      <div className="authComp">
        <div className="container auth-header-cont">
          <header className="unauthHeder">
            <NavLink to="./login">
              <h2>Авторизация</h2>
            </NavLink>
            <h2> | </h2>
            <NavLink to="./Register">
              <h2>Регистрация</h2>
            </NavLink>
          </header>
        </div>

        <main>
          <div className="container auth-header-cont ">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default UnauthorizedLayout;
