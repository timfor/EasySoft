import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import ProductList from "./Card";

import "../App.css";
import "../styles/Faq.css";

const Faq = () => {
  const [backendData, setBackendData] = useState([{}]);

  useEffect(() => {
    fetch("/api/goods")
      .then((response) => response.json())
      .then((data) => {
        setBackendData(data);
      });
  }, []);

  return (
    <>
      <div className="FaqComp">
        <div className="container container-Faq">
          {typeof backendData[0].name === "undefined" ? (
            <h3>Loading...</h3>
          ) : (
            <ProductList products={backendData} />
          )}
        </div>
      </div>
    </>
  );
};

export default Faq;
