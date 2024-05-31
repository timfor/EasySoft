import { DataTypes } from "sequelize";
import sequelize from "../database.js";

export const Good = sequelize.define(
  "Good",
  {
    good_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isAlphanumeric: true,
        len: [1, 100],
      },
    },
    price: {
      type: DataTypes.REAL,
      allowNull: false,
      validate: {
        notEmpty: true,
        isNumeric: { msg: "Должно быть число" },
        max: {
          args: 100000,
          msg: "Price must be less than or equal to 100000",
        },
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: {
          msg: "Description should not be empty if provided",
        },
        len: {
          args: [1, 1000],
          msg: "Description length should be between 1 and 1000 characters",
        },
      },
    },
    img: {
      type: DataTypes.BLOB,
      allowNull: true,
      validate: {
        notEmpty: {
          msg: "img should not be empty if provided",
        },
        isProperSize(value) {
          if (value && value.length > 1024 * 1024 * 10) {
            // Ограничиваем размер до 10 МБ
            throw new Error("Image size should be less than 10MB");
          }
        },
      },
    },
    good_status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
        isInt: true,
      },
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
        isInt: true,
      },
    },
  },
  {
    tableName: "goods",
    timestamps: false,
  }
);

export const GoodStatus = sequelize.define(
  "GoodStatus",
  {
    good_status_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    tableName: "goodsStatuses",
    timestamps: false,
  }
);

export const Category = sequelize.define(
  "Category",
  {
    category_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isAlphanumeric: true,
        len: [1, 100],
      },
    },
  },
  {
    tableName: "categories",
    timestamps: false,
  }
);
