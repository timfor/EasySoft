import express from "express";
import { getAllUsers, updateUser } from "../controllers/usersController.js";
import { updateUserValidation } from "../validations/userValidation.js";

import {
  contentTypeValidator,
  requestBodyValidator,
} from "../middleware/validatorMiddleware.js";

const router = express.Router();

router.get("/", getAllUsers); // get all users  сделать контроллер
router.get("/:user_id"); // get user by user_id
router.delete("/:user_id"); // remove user
router.patch(
  "/:user_id",
  contentTypeValidator,
  requestBodyValidator,
  updateUserValidation,
  updateUser
); // update user

export default router;
