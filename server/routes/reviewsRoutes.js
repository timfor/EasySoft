import express from "express";

// controllers
import {
  getReviewsByGoodId,
  deleteReview,
  createReview,
  updateReview,
} from "../controllers/reviewController.js";

// validations
import {
  updateReviewValidation,
  createReviewValidation,
} from "../validations/reviewValidation.js";

// middlewares
import {
  contentTypeValidator,
  requestBodyValidator,
} from "../middleware/validatorMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/:good_id", getReviewsByGoodId); // get reviews by good_id

router.delete("/:review_id", deleteReview); // remove review

router.post(
  "/create",
  upload.any(),
  contentTypeValidator,
  requestBodyValidator,
  createReviewValidation,
  createReview
); // create review

router.patch(
  "/:review_id",
  upload.any(),
  contentTypeValidator,
  requestBodyValidator,
  updateReviewValidation,
  updateReview
); // update review
export default router;
