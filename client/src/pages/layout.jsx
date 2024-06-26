import React, { useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";

import "../App.css";
import "../styles/layout.css"; // хз надо или нет
import "../styles/auth.css";

import { IconButton } from "@mui/material"; // Импорт необходимых компонентов из MUI
import SearchIcon from "@mui/icons-material/Search";

import Robotimg from "../images/logo2.png";
import { ReactComponent as Profileimg } from "../images/user-regular.svg";

const UnauthorizedLayout = () => {
  const [searchInput, setSearchInput] = useState();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/softs?search=${encodeURIComponent(searchInput)}`);
    setSearchInput("");
  };

  return (
    <>
      <header>
        <div className="container head-cont">
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
            <IconButton type="submit">
              <SearchIcon />
            </IconButton>
          </form>

          <div className="header-right">
            <NavLink to="/contacts">
              <h3>Контакты</h3>
            </NavLink>

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

export default UnauthorizedLayout;
