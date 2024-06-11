import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

import ProductList from "./Card";

const Softs1 = () => {
  const [backendData, setBackendData] = useState([{}]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("/api/goods?limit=50?page=0", {
      method: "GET",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setBackendData(data);
      });
  }, []);

  return (
    <>
      <div className="softsComp">
        <div className="container container-softs">
          <div className="softs-top">
            <h2>Каталог программ</h2>
            <div className="search-softs">
              <input type="text" />
              <button>Поиск</button>
            </div>
          </div>
          <div className="softs-main">
            {typeof backendData[0].name === "undefined" ? (
              <h3></h3>
            ) : (
              <ProductList products={backendData} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Softs1;
