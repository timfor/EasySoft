import express from "express";
import {
  getAllGoods,
  getGoodById,
  createGood,
  updateGood,
  getGoodStatuses,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  deleteGood,
} from "../controllers/goodsController.js";
import {
  createGoodValidation,
  updateGoodValidation,
} from "../validations/goodValidation.js";
import {
  contentTypeValidator,
  requestBodyValidator,
} from "../middleware/validatorMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// пример юзания паспорта мидлвейра
// router.get(
//   "/api/goods",
//   passport.authenticate("jwt", { session: false }),
//   getAllGoodsController
// );

router.get("/", getAllGoods); //✅
router.get("/statuses", getGoodStatuses); //✅
router.get("/categories", getCategories); //✅
router.get("/:good_id", getGoodById); // get good by good_id✅
router.post(
  "/categories/create",
  createCategory,
  upload.any(),
  contentTypeValidator,
  requestBodyValidator,
  // добавить сюда валидацию
  createCategory
); // get good by good_id✅
router.post(
  "/create",
  upload.any(),
  contentTypeValidator,
  requestBodyValidator,
  createGoodValidation,
  createGood
); // create good Проверить с base64 и фронтенд конвертация в base64
router.patch(
  "/:good_id",
  upload.any(),
  contentTypeValidator,
  requestBodyValidator,
  updateGoodValidation,
  updateGood
); // update good
router.patch(
  "/category/:category_id",
  upload.any(),
  contentTypeValidator,
  requestBodyValidator,
  updateCategory
); // update category
router.delete("/category/:category_id", upload.any(), deleteCategory);
router.delete("/:good_id", deleteGood);
export default router;
