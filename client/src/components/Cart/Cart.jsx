import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import useCartStore from "../../context/CartStore.js";
import "../../App.css";
import "../../styles/Cart.css";

import CartElement from "./CartElement.jsx";
import { useAuthStore } from "../../AppStateContext";

const Cart = () => {
  const { cart, totalPrice, removeFromCart, clearCart } = useCartStore();
  const [arr, setArr] = useState([]);
  const { data } = useAuthStore();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const updatedArr = cart.map((item) => {
      return { good_id: item.good_id };
    });
    setArr(updatedArr);
  }, [cart]);

  console.log({ user_id: data.userId, items: arr });

  const createOrder = async () => {
    const body = { user_id: data.userId, items: arr };
    try {
      const resp = await fetch(`/api/orders/create`, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (resp.ok) {
        clearCart();
        const result = await resp.json();
        console.log(result);
        navigate(`/user/${data.userId}/order/${result.order.order_id}`);
      } else {
        console.error("Ошибка при получении данных пользователя");
      }
    } catch (err) {
      console.error("Произошла ошибка", err);
    }
  };

  return (
    <>
      <div className="CartComp">
        <div className="container cart-cont">
          <div className="cart-top">
            <h2>Корзина</h2>
            <button
              onClick={() => {
                clearCart();
                toast.success(`Корзина очищена`);
              }}
            >
              Очистить корзину
            </button>
          </div>
          <div className="cart-content">
            {cart.length === 0 ? (
              <p>Ваша корзина пуста</p>
            ) : (
              cart.map((product) => <CartElement product={product} />)
            )}
          </div>
          <div className="cart-bottom">
            <h3>Стоимость: </h3>
            <p>{totalPrice}.00 р.</p>
            <button onClick={() => createOrder()}>Оформить заказ</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
