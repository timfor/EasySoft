import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

import ProductList from "./Card";

const Softs1 = () => {
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
              <h3>Loading...</h3>
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