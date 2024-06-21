import { create } from "zustand";

const useGoodsStore = create((set) => ({
  userProducts: [],
  fetchUserProducts: async () => {
    // const token = localStorage.getItem("token");
    // const { isAuthenticated, data } = useAuthStore();
    // if (isAuthenticated && token) {
    // }
    // const response = await fetch(
    //   `/api/orders/user/${data.userId}?limit=50?page=0`,
    //   {
    //     method: "GET",
    //     headers: {
    //       Authorization: `${token}`,
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );
    // let arr = [];
    // const products = await response.json();
    // products.forEach((element) => {
    //   if (element.order_status.order_status_id == 2) {
    //     arr = [...arr, ...element.items];
    //   }
    // });
    // const newArr = Array.from(
    //   new Map(arr.map((item) => [item.good_id, item])).values()
    // );
    // console.log(newArr);
    // // set({ userProducts: products });
  },
}));

export default useGoodsStore;
