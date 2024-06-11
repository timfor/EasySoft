import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../AppStateContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "../styles/Orders.css";

const OrderPage = () => {
  const navigate = useNavigate();

  const { user_id, order_id } = useParams();
  const [order, setOrder] = useState([{}]);
  const [price, setPrice] = useState(0);
  const [event, setEvent] = useState(0);
  const { isAuthenticated, data } = useAuthStore();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`/api/orders/${order_id}`, {
      method: "GET",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((dataOrder) => {
        if (dataOrder.user.user_id != data.userId) {
          return navigate("/");
        } else {
          const items = dataOrder.items;
          let prc = 0;

          items.forEach((element) => {
            prc += element.good.price;
          });
          setPrice(prc);
          setOrder(dataOrder);
        }
      });
  }, [isAuthenticated, event]);

  console.log(order);
  if (user_id != data.userId) {
    return navigate("/");
  }

  const buttonClickHandler = async (dataSubmit) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`/api/orders/${order.order_id}`, {
        method: "PATCH",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order_status_id: 2 }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(`Заказ ${order.order_id} успешно оплачен`);
        setEvent(1);
      } else {
        toast.error(result.errors);
      }
    } catch (error) {
      console.error("Ошибка:", error);
      toast.error(["Произошла ошибка при регистрации"]);
    }
  };

  return (
    <>
      {typeof order === "undefined" ? (
        <h3>Ошибка</h3>
      ) : typeof order.order_id === "undefined" ? (
        <></>
      ) : (
        <>
          <div className="BigOrderComp">
            <div className="container orderBigPage-cont">
              <div className="orderElemBigPage">
                <h3>
                  Заказ №{order.order_id} от {order.createdAt.split(" ")[0]}
                </h3>

                {order.items.map((element) => (
                  <h4 key={element.good_id}> - {element.good.name}</h4>
                ))}
                <br />
                <p>Стоимость: {price}.00 р.</p>
                <p>Статус: {order.order_status.name}</p>
                {order.order_status.order_status_id === 1 ? (
                  <button id="payBtnBigOrder" onClick={buttonClickHandler}>
                    Оплатить
                  </button>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default OrderPage;
