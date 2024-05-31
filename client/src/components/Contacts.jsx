import React from "react";
import { NavLink, Outlet } from "react-router-dom";

import "../App.css";
import "../styles/Contacts.css";

const Contacts = () => {
  return (
    <>
      <div className="contactsComp">
        <div className="container container-contacts">
          <h2>Контакты - @tmcrypted</h2>
        </div>
      </div>
    </>
  );
};

export default Contacts;
