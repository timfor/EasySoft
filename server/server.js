import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import morgan from "morgan";
import passport from "passport";

// routes
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import goodRoutes from "./routes/goodRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import reviewsRoutes from "./routes/reviewsRoutes.js";

//middlewares
import passportMiddleware from "./middleware/passportMiddleware.js";
dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(morgan("dev")); // в режиме разработки
app.use(passport.initialize());
passportMiddleware(passport);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const router = express.Router();

// Goods✅
app.use("/api/goods/", goodRoutes);

// Auth✅
app.use("/api/auth/", authRoutes);

// User✅
app.use("/api/users/", userRoutes);

// Orders
app.use("/api/orders/", orderRoutes);

// Reviews
app.use("/api/reviews/", reviewsRoutes);

app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
export default router;
