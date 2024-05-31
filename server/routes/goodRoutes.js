import express from "express";
import { getAllGoods } from "../controllers/goodsController.js";

const router = express.Router();

// пример юзания паспорта мидлвейра
// router.get(
//   "/api/goods",
//   passport.authenticate("jwt", { session: false }),
//   getAllGoodsController
// );

router.get("/", getAllGoods); //
router.get("/:good_id"); // get good by good_id
router.post("/create"); // create good Проверить с base64 и фронтенд конвертация в base64
router.patch("/:good_id"); // update good

export default router;
