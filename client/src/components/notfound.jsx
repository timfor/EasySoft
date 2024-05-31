import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/notfound.css";
import "../App.css";

const Notfound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer); // Очистка таймера при размонтировании компонента
  }, [navigate]);
  return (
    <>
      <div className="nf-cont">
        <div className="nf-child1">
          <h1 id="notfound">Страница не найдена</h1>
          <h2 id="notfound2">Перенаправляю на главную</h2>
        </div>
      </div>
    </>
  );
};

export default Notfound;
