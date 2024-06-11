import { create } from "zustand";

const useCartStore = create((set) => ({
  cart: JSON.parse(localStorage.getItem("cart")) || [],
  totalPrice:
    JSON.parse(localStorage.getItem("cart"))?.reduce(
      (total, item) => total + item.price,
      0
    ) || 0,

  addToCart: (product) =>
    set((state) => {
      const existingProduct = state.cart.find(
        (item) => item.good_id === product.good_id
      );
      if (!existingProduct) {
        const newCart = [...state.cart, { ...product }];
        const newTotalPrice = newCart.reduce(
          (total, item) => total + item.price,
          0
        );
        localStorage.setItem("cart", JSON.stringify(newCart)); // Сохраняем корзину в localStorage
        return { cart: newCart, totalPrice: newTotalPrice };
      } else {
        return { cart: state.cart, totalPrice: state.totalPrice };
      }
    }),

  removeFromCart: (productId) =>
    set((state) => {
      const newCart = state.cart.filter((item) => item.good_id !== productId);
      const newTotalPrice = newCart.reduce(
        (total, item) => total + item.price,
        0
      );
      localStorage.setItem("cart", JSON.stringify(newCart)); // Сохраняем корзину в localStorage
      return { cart: newCart, totalPrice: newTotalPrice };
    }),

  clearCart: () =>
    set(() => {
      localStorage.removeItem("cart"); // Очищаем корзину из localStorage
      return { cart: [], totalPrice: 0 };
    }),
}));

export default useCartStore;
