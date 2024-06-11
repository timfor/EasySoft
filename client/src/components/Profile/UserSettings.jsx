import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../AppStateContext";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEventStore } from "../../context/useEventStore.js";

import "../../styles/Settings.css";

const Settings = () => {
  const [userData, setUserData] = useState([{}]);
  const [serverErrors, setServerErrors] = useState([]);

  const { setEvent } = useEventStore();

  const { isAuthenticated, data } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({
    mode: "onBlur",
  });

  const onSubmit = async (dataSubmit) => {
    const formData = new FormData();
    if (dataSubmit.name) {
      formData.append("name", dataSubmit.name);
    }

    if (dataSubmit.img[0]) {
      formData.append("img", dataSubmit.img[0]);
    }

    if (!dataSubmit.name && !dataSubmit.img[0]) {
      setServerErrors({ errors: ["Поля не заполнены"] });
    } else {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/users/${data.userId}`, {
          method: "PATCH",
          headers: {
            Authorization: `${token}`,
          },
          body: formData,
        });

        const result = await response.json();

        if (response.ok) {
          setEvent({ type: "" });
          toast.success("Данные изменены");
          setServerErrors([]);
        } else {
          setServerErrors(result.errors);
        }
      } catch (error) {
        console.error("Ошибка:", error);
        setServerErrors(["Произошла ошибка при изменении" + error]);
      }
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (isAuthenticated && token) {
          const response = await fetch(`/api/users/${data.userId}`, {
            method: "GET",
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUserData(userData);
          } else {
            console.error("Ошибка при получении данных пользователя");
          }
        }
      } catch (error) {
        console.error("Произошла ошибка", error);
      }
    };

    fetchUserData();
  }, [isAuthenticated]);

  return (
    <>
      <div className="prof-right2">
        <h2>Настройки профиля</h2>
        <form className="settingsProfile" onSubmit={handleSubmit(onSubmit)}>
          <p id="nameSettings">Имя</p>
          <input
            id="nameSettingsInp"
            {...register("name")}
            Value={userData.name}
          />

          <p id="imgSettings">Картинка профиля</p>
          <input
            id="imgSettingsInp"
            type="file"
            {...register("img")}
            accept="image/*"
          />
          <div style={{ minHeight: 33 }}>
            {errors?.img && (
              <p style={{ marginTop: 5, color: "red" }}>
                {errors.img.message || "Ошибка"}
                {serverErrors}
              </p>
            )}
          </div>

          <input
            id="changeBtnSettings"
            type="submit"
            value="Изменить"
            disabled={!isValid}
          />
        </form>
      </div>
    </>
  );
};

export default Settings;
