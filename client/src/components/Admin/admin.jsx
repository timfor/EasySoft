import React from "react";
import useCartStore from "../../context/CartStore.js";
import { useAuthStore } from "../../AppStateContext.js";
import { NavLink, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { Link } from "react-router-dom";
import "../../styles/admin.css";

const AdminPage = () => {
  const { cart, addToCart, removeFromCart, clearCart } = useCartStore();
  const { isAuthenticated, role } = useAuthStore();

  return (
    <>
      <div className="AdminComp">
        <div className="container adm-cont">
          <div className="prof-left-first">
            <h2>Выберите действие:</h2>
            <NavLink id="prof-link" to="./newGood">
              <h3>Добавить товар</h3>
            </NavLink>
            <NavLink id="prof-link" to="./newCategory">
              <h3>Добавить категорию</h3>
            </NavLink>
            <NavLink id="prof-link" to="./goods">
              <h3>Товары</h3>
            </NavLink>
            <NavLink id="prof-link" to="./categories">
              <h3>Категории</h3>
            </NavLink>
          </div>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminPage;
