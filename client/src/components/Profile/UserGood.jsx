import React from "react";
import { Link } from "react-router-dom";

const UserOrder = ({ orders }) => {
  return (
    <>
      <div className="orders-cards">
        {orders.map((order) => {
          const items = order.items;
          let price = 0;

          items.forEach((element) => {
            price += element.good.price;
          });

          return (
            <div className="orderCard">
              <h3>
                Заказ №{order.order_id} от {order.createdAt.split(" ")[0]}
              </h3>
              {items.map((element) => (
                <p key={element.good_id}>{element.good.name}</p>
              ))}
              <p>{order.order_status.name}</p>
              {price}.00 р.
            </div>
          );
        })}
      </div>
    </>
  );
};

export default UserOrder;
