import { Navigate, Routes, Route } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";

// styles
import "./App.css"; // добавить стилей
import "./styles/Softs.css";

//components
import Notfound from "./components/notfound";

import Layout from "./pages/layout";
import LayoutAuth from "./pages/AuthLayout";
import UnauthorizedLayout from "./pages/UnauthorizedLayout";

import Main from "./components/Main";
import Softs1 from "./components/Softs1";
import Soft from "./components/Soft";
import Faq from "./components/Faq";
import Cart from "./components/Cart/Cart.jsx";

import Contacts from "./components/Contacts";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register.jsx";

import Profile from "./components/Profile/Profile.jsx";
import Orders from "./components/Profile/UserOrders.jsx";
import Settings from "./components/Profile/UserSettings.jsx";
import UserGoods from "./components/Profile/UserGoods.jsx";

import OrderPage from "./components/OrderPage.jsx";

import AdminPage from "./components/Admin/admin.jsx";
import AdminCategories from "./components/Admin/AdminCategories.jsx";
import AdminGoods from "./components/Admin/AdminGoods.jsx";
import NewCategory from "./components/Admin/NewCategory.jsx";
import NewGood from "./components/Admin/NewGood.jsx";

import PrivateRoute from "./routes/PrivateRoute.jsx";
import { useAuthStore } from "./AppStateContext.js";

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const data = useAuthStore((state) => state.data);
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated === false ? <Layout /> : <LayoutAuth />}
        >
          <Route index element={<Main />} />
          <Route path="softs" element={<Softs1 />} />
          <Route path="soft/:good_id" element={<Soft />} />

          <Route
            path="cart"
            element={<PrivateRoute element={<Cart />} requiredRole={1} />}
          />

          <Route
            path="user/:user_id/order/:order_id"
            element={<PrivateRoute element={<OrderPage />} requiredRole={1} />}
          />

          <Route
            path="profile"
            element={<PrivateRoute element={<Profile />} requiredRole={1} />}
          >
            <Route index element={<Navigate to="orders" replace={true} />} />
            <Route path="orders" element={<Orders />} />
            <Route path="settings" element={<Settings />} />
            <Route path="goods" element={<UserGoods />} />
          </Route>

          <Route path="contacts" element={<Contacts />} />

          {data && data.roleId >= 2 ? (
            <>
              <Route path="admin" element={<AdminPage />}>
                <Route
                  index
                  element={<Navigate to="newGood" replace={true} />}
                />
                <Route path="newGood" element={<NewGood />} />
                <Route path="newCategory" element={<NewCategory />} />
                <Route path="goods" element={<AdminGoods />} />
                <Route path="categories" element={<AdminCategories />} />
              </Route>
            </>
          ) : (
            <></>
          )}

          {!isAuthenticated ? (
            <Route path="/auth" element={<UnauthorizedLayout />}>
              <Route index element={<Navigate to="login" replace={true} />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
          ) : (
            <Route path="/auth" element={<Navigate to="/" replace={true} />} />
          )}
        </Route>

        <Route path="*" element={<Notfound />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={5500}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
        limit={9}
      />
      {/* Контейнер для уведомлений */}
    </>
  );
}

export default App;
