import React from "react";
import { NavLink, Outlet } from "react-router-dom";

import "../styles/main.css";

const Main = () => {
  return (
    <>
      <div className="mainComp">
        <div className="container-main">
          <div className="block-main-name" id="b1">
            <h1>⚙️EasySoft - программы автоматизации </h1>
          </div>

          <div className="block-main-2">
            <h1 id="b2">О нас 👇</h1>
            <p id="lineThrough"></p>
            <h3 id="b3">
              Easysoft специализируется на продаже программ для автоматизации
              процесов
            </h3>
            <p id="lineThrough"></p>
            <h3 id="b3">
              Мы дорожим доверием клиентов, поэтому всегда ответим на все ваши
              вопросы.
            </h3>
            <p id="lineThrough"></p>
            <h3 id="b4">
              Мы предоставляем гарантии и поддержку наших программ.
            </h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
