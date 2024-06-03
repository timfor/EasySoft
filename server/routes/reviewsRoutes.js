import express from "express";

import { register, login } from "../controllers/authController.js";

import {
  authLoginValidation,
  authRegisterValidation,
} from "../validations/authValidations.js";

import {
  contentTypeValidator,
  requestBodyValidator,
} from "../middleware/validatorMiddleware.js";

import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/:good_id"); // get review by good_id
router.delete("/:review_id"); // remove review
router.post("/create"); // create review
router.patch("/:review_id"); // update review

// router.post(
//   "/register",
//   upload.any(),
//   contentTypeValidator,
//   requestBodyValidator,
//   authRegisterValidation,
//   register
// );
// router.post(
//   "/login",
//   upload.any(),
//   contentTypeValidator,
//   requestBodyValidator,
//   authLoginValidation,
//   login
// );
export default router;
