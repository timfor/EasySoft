import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../AppStateContext";

import "../../styles/UserGoods.css";

const UserGoods = () => {
  const [goodsBackend, setGoods] = useState([]);
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
        let arr = [];
        if (data.success == false) {
        } else {
          data.forEach((element) => {
            if (element.order_status.order_status_id == 2) {
              // выбираем оплаченные заказы
              arr = [...arr, ...element.items];
            }
          });
        }
        setGoods(
          Array.from(new Map(arr.map((item) => [item.good_id, item])).values())
        );
      });
  }, []);

  return (
    <>
      <div className="prof-right">
        <h2>Ваши программы: </h2>
        {typeof goodsBackend[0] === "undefined" ? (
          <h3>У вас нету купленных программ</h3>
        ) : typeof goodsBackend[0].good_id === "undefined" ? (
          <h3>хс</h3>
        ) : (
          <>
            {goodsBackend.map((element) => (
              <>
                <p>
                  id {element.good_id} {element.good.name}{" "}
                  <button>Скачать</button>
                </p>
              </>
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default UserGoods;
