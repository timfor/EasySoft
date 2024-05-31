import React from "react";
import { NavLink, Outlet } from "react-router-dom";

import "../App.css";
import "../styles/Cart.css";

const Cart = () => {
  return (
    <>
      <div className="CartComp">
        <div className="container container-Cart">
          <h2>Cart</h2>
        </div>
      </div>
    </>
  );
};

export default Cart;
