import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../AppStateContext";
import "../../styles/UserGoods.css";

const UserGoods = () => {
  const [goodsBackend, setGoods] = useState([]);
  const { data } = useAuthStore();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`/api/orders/user/${data.userId}?limit=50&page=0`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let arr = [];
        if (data.success === false) {
          // handle error if needed
        } else {
          data.forEach((element) => {
            if (element.order_status.order_status_id === 2) {
              // выбираем оплаченные заказы
              arr = [...arr, ...element.items];
            }
          });
        }
        setGoods(
          Array.from(new Map(arr.map((item) => [item.good_id, item])).values())
        );
      });
  }, [data.userId, token]);

  console.log(JSON.stringify(goodsBackend));
  return (
    <div className="prof-right">
      <div className="user-goods-container">
        <h2>Ваши программы:</h2>
        {goodsBackend.length === 0 ? (
          <h3>У вас нет купленных программ</h3>
        ) : (
          goodsBackend.map((element) => (
            <div key={element.good_id} className="user-good-item">
              <div className="imgGoodProf">
                {" "}
                <img
                  src={`data:image/png;base64,${element.good.img}`}
                  alt={element.name}
                  className="item-image"
                />
                <p className="MygoodNameProf">{element.good.name}</p>
              </div>
              <p>
                <Link to={`/soft/${element.good_id}`}>
                  <button className="download-button">Скачать</button>
                </Link>
                <Link to={`/soft/${element.good_id}`}>
                  <button className="review-button">Оставить отзыв</button>
                </Link>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserGoods;
