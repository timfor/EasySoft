import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../AppStateContext";

const UserOrder = ({ orders }) => {
  const { isAuthenticated, data } = useAuthStore();

  return (
    <div className="order-cards">
      {orders.map((order) => {
        const items = order.items;
        let price = 0;

        items.forEach((element) => {
          if (element.good) price += element.good.price;
        });

        return (
          <Link to={`/user/${data.userId}/order/${order.order_id}`}>
            <div className="order-card" key={order.order_id}>
              <div className="order-details">
                <div className="order-details-first">
                  <h3>Заказ №{order.order_id}</h3>
                </div>
                <div className="order-details-second">
                  <p id="totalStatus">
                    Статус:{" "}
                    {order.order_status.order_status_id === 1 ? (
                      <p id="statusPaymetProcess">{order.order_status.name}</p>
                    ) : order.order_status.order_status_id === 2 ? (
                      <p id="statusPaymetReady">{order.order_status.name}</p>
                    ) : (
                      <p>{order.order_status.name}</p>
                    )}
                  </p>

                  <p>Итого: {price}.00 р.</p>
                </div>
              </div>
              <div className="order-items">
                {items.map((item) => (
                  <div className="order-item" key={item.good_id}>
                    <img
                      src={`data:image/png;base64,${item.good.img}`}
                      alt={item.good.name}
                      className="item-image"
                    />
                    <div className="item-details">
                      <p>{item.good.name}</p>
                      <p>{item.good.price}.00 р.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default UserOrder;
