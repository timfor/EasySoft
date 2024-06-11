import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../AppStateContext";

const UserOrder = ({ orders }) => {
  const { isAuthenticated, data } = useAuthStore();

  return (
    <>
      <div className="orders-cards">
        {orders.map((order) => {
          const items = order.items;
          let price = 0;

          items.forEach((element) => {
            if (element.good) price += element.good.price;
          });

          return (
            <Link to={`/user/${data.userId}/order/${order.order_id}`}>
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
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default UserOrder;
