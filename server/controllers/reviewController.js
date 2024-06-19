import { Review, User, Good, UserRole } from "../models/relations.js";
import { validationResult } from "express-validator";

export const getReviewsByGoodId = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5; // По умолчанию 5 записей
    const page = parseInt(req.query.page) || 0; // Номер страницы

    const reviews = await Review.findAll({
      where: {
        good_id: req.params.good_id,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "email", "name", "img"],
          include: [
            {
              model: UserRole,
              as: "role",
            },
          ],
        },
      ],
      attributes: ["review_id", "good_id", "text"],
      limit: limit,
      offset: page * limit,
    });
    if (!reviews) {
      return res.status(404).json({ message: "Not found" });
    }

    reviews.forEach((row) => {
      row.user.img = Buffer.from(row.user.img).toString("base64");
    });

    return res.status(200).json(reviews);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.review_id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await review.destroy();
    return res
      .status(200)
      .json({ success: true, message: "Отзыв успешно удален" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }

    const resReview = await Review.create(req.body);
    return res
      .status(201)
      .json({ success: true, message: "Отзыв добавлен", data: resReview });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }

    const review = await Review.findByPk(req.params.review_id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await review.update(req.body);
    return res
      .status(200)
      .json({ success: true, message: "Успешно текст отзыва" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
