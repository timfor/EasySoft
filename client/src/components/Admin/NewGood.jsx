import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Select, MenuItem, Button } from "@mui/material";

import { useAuthStore } from "../../AppStateContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "../../styles/addGood.css";

const NewGood = () => {
  const { isAuthenticated, data } = useAuthStore();
  const token = localStorage.getItem("token");
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const asyncFetch = async () => {
      try {
        if (isAuthenticated && token) {
          const response = await fetch("/api/goods/statuses", {
            method: "GET",
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json",
            },
          });
          const statusesData = await response.json();

          if (response.ok) {
            setOrderStatuses(statusesData);
          } else {
            toast.error("Ошибка" + JSON.stringify(statusesData));
          }

          const response2 = await fetch("/api/goods/categories", {
            method: "GET",
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json",
            },
          });
          const categoriesData = await response2.json();

          if (response2.ok) {
            setCategories(categoriesData);
          } else {
            toast.error("Ошибка" + JSON.stringify(categoriesData));
          }
        }
      } catch (err) {
        toast.error("Ошибка" + JSON.stringify(err));
      }
    };

    asyncFetch();
  }, []);

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({
    mode: "onBlur",
  });

  const onSubmit = async (dataSubmit) => {
    const formData = new FormData();
    formData.append("name", dataSubmit.name);
    formData.append("price", dataSubmit.price);
    formData.append("good_status_id", +dataSubmit.good_status_id);
    formData.append("category_id", +dataSubmit.category_id);

    if (dataSubmit.description) {
      formData.append("description", dataSubmit.description);
    }

    if (dataSubmit.img[0]) {
      formData.append("img", dataSubmit.img[0]);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/goods/create`, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(`Товар добавлен`);
      } else {
        toast.error("Ошибка " + JSON.stringify(result.message));
      }
    } catch (error) {
      console.error("Ошибка:", JSON.stringify(error));
    }
  };
  console.log(categories);

  return (
    <>
      <div className="prof-right-add-good">
        <h2>Добавить товар</h2>

        <form className="newGoodCont" onSubmit={handleSubmit(onSubmit)}>
          <p id="nameGood">Название</p>
          <input
            id="AddGoodInp"
            {...register("name", {
              required: "Поле не должно быть пустым",
              minLength: {
                value: 2,
                message: "Минимум 2 символа",
              },
            })}
          />
          <div style={{ minHeight: 20 }}>
            {errors?.name && (
              <p style={{ color: "red" }}>{errors.name.message || "Ошибка"}</p>
            )}
          </div>

          <p id="priceGood">Цена</p>
          <input
            id="AddGoodInp"
            type="number"
            {...register("price", {
              required: "Поле не должно быть пустым и должно быть число",
              min: {
                value: 1,
                message: "Минимальная цена 1 рубль",
              },
            })}
          />
          <div style={{ minHeight: 20 }}>
            {errors?.price && (
              <p style={{ color: "red" }}>{errors.price.message || "Ошибка"}</p>
            )}
          </div>

          <p id="descriptionGood">Описание</p>
          <input id="AddGoodInp" {...register("description")} />
          <div style={{ minHeight: 20 }}>
            {errors?.img && (
              <p style={{ color: "red" }}>{errors.img.message || "Ошибка"}</p>
            )}
          </div>

          <p id="imgGood">Картинка товара</p>
          <input
            id="AddGoodInp"
            type="file"
            {...register("img")}
            accept="image/*"
          />
          <div style={{ minHeight: 20 }}>
            {errors?.img && (
              <p style={{ color: "red" }}>{errors.img.message || "Ошибка"}</p>
            )}
          </div>

          <p id="good_status_id">Статус товара</p>
          <div className="selectAddGood">
            {orderStatuses[0] ? (
              <Select
                {...register("good_status_id", {
                  required: "Поле обязательно к заполнению",
                })}
                label="Выберите параметр"
                error={!!errors.selectOption}
                defaultValue={orderStatuses[0].good_status_id}
                s
              >
                <MenuItem value="" disabled>
                  Выберите статус
                </MenuItem>
                {orderStatuses.map((status) => (
                  <MenuItem
                    key={status.good_status_id}
                    value={status.good_status_id}
                  >
                    {status.name}
                  </MenuItem>
                ))}
              </Select>
            ) : (
              <></>
            )}
          </div>

          <p id="category_id">Категория товара</p>
          <div className="selectAddGood">
            {categories[0] ? (
              <Select
                {...register("category_id", {
                  required: "Поле обязательно к заполнению",
                })}
                label="Выберите параметр"
                error={!!errors.selectOption}
                defaultValue={categories[0].category_id}
              >
                <MenuItem value="" disabled>
                  Выберите статус
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            ) : (
              <></>
            )}
          </div>

          <input
            id="addBtnSettings"
            type="submit"
            value="Добавить"
            disabled={!isValid}
          />
        </form>
      </div>
    </>
  );
};

export default NewGood;
