import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Select, MenuItem, Button } from "@mui/material";

import { useAuthStore } from "../../AppStateContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "../../styles/addCategory.css";

const NewCategory = () => {
  const { isAuthenticated, data } = useAuthStore();
  const token = localStorage.getItem("token");

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({
    mode: "onBlur",
  });

  const onSubmit = async (dataSubmit) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/goods/categories/create`, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: dataSubmit.name }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(`Категория добавлена`);
      } else {
        toast.error("Ошибка " + JSON.stringify(result.message));
      }
    } catch (error) {
      toast.error("Ошибка " + JSON.stringify(error));
    }
  };

  return (
    <>
      <div className="prof-right-add-category">
        <h2>Добавить категорию</h2>

        <form className="newCategoryCont" onSubmit={handleSubmit(onSubmit)}>
          <p id="nameCategory">Название</p>
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

export default NewCategory;
