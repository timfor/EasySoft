import React from "react";
import { NavLink, Outlet } from "react-router-dom";

import "../styles/main.css";

const Main = () => {
  return (
    <>
      <div className="mainComp">
        <div className="container-main">
          <div className="block" id="b1">
            <h1>AutoSoft - быстрые решения</h1>
            <p></p>
          </div>
          <div className="block" id="b2">
            <h1>Главная</h1>
          </div>
          <div className="block" id="b3">
            <h1>Главная</h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
