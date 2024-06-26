import express from "express";
import {
  getAllOrders,
  getOrderById,
  getAllUserOrders,
  createOrder,
  updateOrder,
} from "../controllers/ordersController.js";

import {
  createOrderValidation,
  updateOrderValidation,
} from "../validations/orderValidation.js";
import {
  contentTypeValidator,
  requestBodyValidator,
} from "../middleware/validatorMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getAllOrders); // get all orders
router.get("/:order_id", getOrderById); // get order by order_id
router.get("/user/:user_id", getAllUserOrders); // все заказы пользователя✅
router.delete("/:order_id"); // remove order?????
router.post(
  "/create",
  upload.any(),
  contentTypeValidator,
  requestBodyValidator,
  createOrderValidation,

  createOrder
); // create order✅
router.patch(
  "/:order_id",
  upload.any(),
  contentTypeValidator,
  requestBodyValidator,
  updateOrderValidation,

  updateOrder
); // update order

export default router;
