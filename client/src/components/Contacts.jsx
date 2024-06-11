import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { toast } from "react-toastify";

import "../App.css";
import "../styles/Contacts.css";

const Contacts = () => {
  return (
    <>
      <div className="contactsComp">
        <div className="container container-contacts">
          <h2>
            Вы всегда можете обратится по нашему адресу <br /> электронной почты
          </h2>
          <h2>help-tech@easysoft.ru</h2>

          <h3>Если у вас есть предложение, можете оставить его тут</h3>
          <textarea
            id="suggestionC"
            rows="5"
            cols="50"
            placeholder="Напишите ваше предложение здесь..."
          ></textarea>
          <button
            onClick={() => {
              toast.success(`Предложение отправлено`);
            }}
            id="sendSuggest"
          >
            Отправить
          </button>
        </div>
      </div>
    </>
  );
};

export default Contacts;
