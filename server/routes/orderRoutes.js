import express from "express";
import { getAllOrders, getOrderById } from "../controllers/ordersController.js";

const router = express.Router();

router.get("/", getAllOrders); // get all orders ✅
router.get("/:order_id", getOrderById); // get order by order_id
router.get("/:user_id"); // все заказы пользователя
router.delete("/:order_id"); // remove order
router.post("/create"); // create order
router.patch("/:order_id"); // update order

export default router;
