import React, { useState, useEffect } from "react";
import useCartStore from "../context/CartStore.js";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";

import useGoodsStore from "../context/GoodsStore.js";
import { useAuthStore } from "../AppStateContext.js";

import {
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"; // Импорт необходимых компонентов из MUI
import DeleteIcon from "@mui/icons-material/Delete"; // Импорт иконки удаления из MUI

const SoftBigCard = ({ product }) => {
  const base64Img = product.img;
  const imageUrl = `data:image/png;base64,${base64Img}`;
  const { cart, addToCart, removeFromCart, clearCart } = useCartStore();
  const token = localStorage.getItem("token");
  const [goodsBackend, setGoods] = useState([]);
  const [isHaveGood, setHaveGood] = useState(false);

  const { isAuthenticated, data } = useAuthStore();
  // const { userProducts, fetchUserProducts } = useGoodsStore();

  // fetchUserProducts(65);

  const [reviews, setReviews] = useState([]);
  const [event, setEvent] = useState(true);

  useEffect(() => {
    if (data !== null) {
      const asyncFetch2 = async () => {
        try {
          const ordersResponse = await fetch(
            `/api/orders/user/${data.userId}?limit=50555&page=0`,
            {
              method: "GET",
              headers: {
                Authorization: token,
                "Content-Type": "application/json",
              },
            }
          );

          const ordersDataJson = await ordersResponse.json();
          let arr = [];

          if (ordersResponse.ok) {
            ordersDataJson.forEach((element) => {
              if (element.order_status.order_status_id === 2) {
                // выбираем оплаченные заказы
                arr = [...arr, ...element.items];
              }
            });

            setGoods(
              Array.from(
                new Map(arr.map((item) => [item.good_id, item])).values()
              )
            );
            arr.forEach((element) => {
              if (element.good_id == product.good_id) {
                setHaveGood(true);
              }
            });
          } else {
            // Handle error if needed
            console.error("Ошибка получения данных заказов:", ordersDataJson);
          }
        } catch (error) {
          console.error("Ошибка получения данных заказов:", error);
        }
      };

      asyncFetch2();
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    const asyncFetch = async () => {
      if (isAuthenticated && token) {
        try {
          const response = await fetch(
            `/api/reviews/${product.good_id}?limit=50?page=0`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const reviewsData = await response.json();

          if (response.ok) {
            setReviews(reviewsData);
          } else {
            toast.error("Ошибка" + JSON.stringify(reviewsData));
          }
        } catch (err) {
          toast.error("Ошибка" + JSON.stringify(err));
        }
      }
    };

    asyncFetch();
  }, [event, isAuthenticated]);

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({
    mode: "onBlur",
  });

  const onSubmit = async (dataSubmit) => {
    const obgSend = {
      user_id: data.userId,
      good_id: product.good_id,
      ...dataSubmit,
    };

    if (isAuthenticated && token) {
      try {
        const response = await fetch(`/api/reviews/create`, {
          method: "POST",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obgSend),
        });

        const result = await response.json();

        if (response.ok) {
          toast.success(`отзыв добавлен`);
          setEvent(!event);
        } else {
          toast.error("Ошибка " + JSON.stringify(result.message));
        }
      } catch (error) {
        console.error("Ошибка:", JSON.stringify(error));
      }
    }
  };
  const handleDeleteClick = async (review_id) => {
    try {
      const response = await fetch(`/api/reviews/${review_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setEvent(!event);

        toast.success("Отзыв успешно удален.");
      } else {
        const errorData = await response.json();
        toast.error("Ошибка: " + JSON.stringify(errorData));
      }
    } catch (err) {
      toast.error("Ошибка: " + JSON.stringify(err));
    }
  };

  return (
    <>
      <div className="container ">
        <div className="container-big-soft">
          <div className="upside-soft">
            <div className="bigSoft-leftside">
              <img src={imageUrl} alt="нету фото" />
              <div className="nameNcategory">
                <h1>{product.name}</h1>
                <h3>{product.category.name}</h3>
              </div>
            </div>
            <div className="bigSoft-rightside">
              <div>
                <p id="PriceText">Цена: </p>
                <br />
                <p id="PriceNumRed">{product.price},00 ₽</p>
              </div>
              {isAuthenticated ? (
                <>
                  {product.good_status_id === 1 ? (
                    <button
                      id="btnBuyGood"
                      onClick={() => {
                        addToCart(product);
                        toast.success(`${product.name} добавлен в корзину!`);
                      }}
                    >
                      В корзину
                    </button>
                  ) : (
                    <button id="btnBuyGooddis" disabled>
                      {product.status.name}
                    </button>
                  )}
                </>
              ) : (
                <>
                  <Link to="/auth">
                    <button id="btnBuyGood">Войти</button>
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="description-soft">
            <p id="desc-name-soft-page">Описание</p>
            <p id="desc-content-soft-page">{product.description}</p>
          </div>
        </div>
        <div className="commentSection">
          <h2>Отзывы</h2>
          {isHaveGood == true ? (
            <form className="commentForm" onSubmit={handleSubmit(onSubmit)}>
              <textarea
                id="reviewInput"
                placeholder="Напишите свой отзыв здесь..."
                {...register("text", {
                  required: "Поле не должно быть пустым",
                })}
              />

              <input
                id="commentButton"
                type="submit"
                value="Отправить"
                disabled={!isValid}
              />
            </form>
          ) : isHaveGood == false ? (
            <form className="commentForm" onSubmit={handleSubmit(onSubmit)}>
              <textarea
                id="reviewInput"
                placeholder="Чтобы оставить отзыв - вы должны приобрести товар"
                {...register("text", {
                  required: "Поле не должно быть пустым",
                })}
                disabled={true}
              />

              <input
                id="commentButton"
                type="submit"
                value="Отправить"
                disabled={true}
              />
            </form>
          ) : (
            <>zxzxzx</>
          )}

          <hr style={{ border: "1px solid black", width: "100%" }} />

          {reviews[0] ? (
            reviews.map((comment) => (
              <CommentItem
                key={comment.review_id}
                comment={comment}
                onDeleteClick={handleDeleteClick}
                trueUserIdReal={data.userId}
              />
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

const CommentItem = ({ comment, onDeleteClick, trueUserIdReal }) => {
  const { createdAt, text, user, review_id } = comment;
  return (
    <div className="comment-item">
      <div className="comment-item-2">
        <img
          src={`data:image/jpeg;base64,${user.img}`}
          alt={`${user.name}'s avatar`}
          className="avatarComment"
        />
        <div className="comment-content">
          <div className="createdAtReview">
            <h3>{user.name}</h3>
            <p> {createdAt.split(".")[0]}</p>
          </div>
          <p>{text}</p>
        </div>
      </div>
      <div>
        {" "}
        {user.user_id === trueUserIdReal ? (
          <IconButton onClick={() => onDeleteClick(review_id)}>
            <DeleteIcon />
          </IconButton>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
export default SoftBigCard;
