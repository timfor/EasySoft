import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();
const SQLITEURL = process.env.SQLITEURL;

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: SQLITEURL, // Путь к файлу базы данных
});

export default sequelize;
