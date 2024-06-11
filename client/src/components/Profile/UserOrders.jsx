import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../AppStateContext";

import OrdersList from "./UserOrder";

import "../../styles/Orders.css";

const Orders = () => {
  const [ordersback, setOrders] = useState([{}]);
  const { data } = useAuthStore();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`/api/orders/user/${data.userId}?limit=50?page=0`, {
      method: "GET",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setOrders(data);
      });
  }, []);

  return (
    <>
      <div className="prof-right">
        <h2>Ваши заказы: </h2>
        {typeof ordersback[0] === "undefined" ? (
          <h3>Нет заказов</h3>
        ) : typeof ordersback[0].order_id === "undefined" ? (
          <h3></h3>
        ) : (
          <OrdersList orders={ordersback} />
        )}
      </div>
    </>
  );
};

export default Orders;
