import React, { useState, useEffect } from "react";
import useCartStore from "../context/CartStore.js";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";

import useGoodsStore from "../context/GoodsStore.js";
import { useAuthStore } from "../AppStateContext.js";

const SoftBigCard = ({ product }) => {
  const base64Img = product.img;
  const imageUrl = `data:image/png;base64,${base64Img}`;
  const { cart, addToCart, removeFromCart, clearCart } = useCartStore();
  const token = localStorage.getItem("token");

  const { isAuthenticated, data } = useAuthStore();
  // const { userProducts, fetchUserProducts } = useGoodsStore();

  // fetchUserProducts(65);

  const [reviews, setReviews] = useState([]);
  const [event, setEvent] = useState(0);

  useEffect(() => {
    const asyncFetch = async () => {
      if (isAuthenticated && token) {
        try {
          const response = await fetch(
            `/api/reviews/${product.good_id}?limit=50?page=0`,
            {
              method: "GET",
              headers: {
                Authorization: `${token}`,
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
  }, [event]);

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
          setEvent(1);
        } else {
          toast.error("Ошибка " + JSON.stringify(result.message));
        }
      } catch (error) {
        console.error("Ошибка:", JSON.stringify(error));
      }
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

          <hr style={{ border: "1px solid black", width: "100%" }} />

          {reviews[0] ? (
            reviews.map((comment) => (
              <CommentItem key={comment.review_id} comment={comment} />
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

const CommentItem = ({ comment }) => {
  const { text, user } = comment;
  return (
    <div className="comment-item">
      <img
        src={`data:image/jpeg;base64,${user.img}`}
        alt={`${user.name}'s avatar`}
        className="avatarComment"
      />
      <div className="comment-content">
        <h3>{user.name}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
};
export default SoftBigCard;
