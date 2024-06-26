import express from "express";

import {
  getAllUsers,
  updateUser,
  getUserById,
  deleteUser,
} from "../controllers/usersController.js";
import { updateUserValidation } from "../validations/userValidation.js";

import {
  contentTypeValidator,
  requestBodyValidator,
} from "../middleware/validatorMiddleware.js";

import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getAllUsers); // get all users  сделать контроллер
router.get("/:user_id", getUserById); // get user by user_id
router.delete("/:user_id", deleteUser); // remove user
router.patch(
  "/:user_id",
  upload.any(),
  contentTypeValidator,
  requestBodyValidator,
  updateUserValidation,

  updateUser
); // update user

export default router;
