import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import useCartStore from "../../context/CartStore.js";
import { useAuthStore } from "../../AppStateContext.js";

const CartElement = ({ product }) => {
  const base64Img = product.img;
  const imageUrl = `data:image/png;base64,${base64Img}`;
  const { cart, addToCart, removeFromCart, clearCart } = useCartStore();
  const { isAuthenticated, role } = useAuthStore();

  return (
    <>
      <div className="cart-elem">
        <div className="r_cart_elem">
          <img src={imageUrl} alt="Нет фото" />
          <h3>{product.name}</h3>
        </div>
        <div className="l_cart_elem">
          <p>{product.price}.00 р.</p>
          <button
            onClick={() => {
              removeFromCart(product.good_id);
              toast.success(`${product.name} удален из корзины`);
            }}
          >
            Удалить
          </button>
        </div>
      </div>
    </>
  );
};

export default CartElement;
