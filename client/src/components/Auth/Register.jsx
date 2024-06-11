import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";

const Register = () => {
  const [serverErrors, setServerErrors] = useState([]);
  const navigate = useNavigate();

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({
    mode: "onBlur",
  });
  const onSubmit = async (data) => {
    // alert(JSON.stringify(data));
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setServerErrors([]);
        alert("Пользователь успешно зарегистрирован");
        setTimeout(() => {
          navigate("/auth/login");
        }, 1000); // 2 секунды ожидания перед перенаправлением
      } else {
        setServerErrors(result.errors);
      }
    } catch (error) {
      console.error("Ошибка:", error);
      setServerErrors(["Произошла ошибка при регистрации"]);
    }
  };

  return (
    <>
      <form className="unauthMainContainer" onSubmit={handleSubmit(onSubmit)}>
        <p id="emailAuth">Email</p>
        <input
          id="emailAuth"
          {...register("email", {
            required: "Поле не должно быть пустым",
            pattern: {
              value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: "Строка должна быть корректным email",
            },
          })}
        />
        <div style={{ minHeight: 33 }}>
          {errors?.email && (
            <p style={{ marginTop: 5, color: "red" }}>
              {errors?.email?.message || "Ошибка"}
            </p>
          )}
        </div>

        <p id="passAuth">Password</p>
        <input
          id="passAuth"
          type="password"
          {...register("password", {
            required: "Поле не должно быть пустым",
            minLength: {
              value: 6,
              message: "Минимум 6 символов",
            },
            validate: {
              hasUppercase: (value) =>
                /[A-Z]/.test(value) ||
                "Пароль должен содержать минимум одну заглавную букву",
              hasLowercase: (value) =>
                /[a-z]/.test(value) ||
                "Пароль должен содержать минимум одну строчную букву",
              hasNumber: (value) =>
                /[0-9]/.test(value) ||
                "Пароль должен содержать минимум одну цифру",
            },
          })}
        />
        <div style={{ minHeight: 33 }}>
          <p style={{ marginTop: 5, color: "red" }}>
            {errors?.password ? (
              <>
                {errors?.password?.message || "Ошибка"}
                <br />
              </>
            ) : (
              <></>
            )}
            {serverErrors}
          </p>
        </div>

        <input
          id="authButton"
          type="submit"
          value="Зарегистрироваться"
          disabled={!isValid}
        />
      </form>
    </>
  );
};

export default Register;
