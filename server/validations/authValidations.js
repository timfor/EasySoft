import { body } from "express-validator";

export const authRegisterValidation = [
  body().custom((value, { req }) => {
    const allowedKeys = ["email", "password"];
    const keys = Object.keys(req.body);
    const invalidKeys = keys.filter((key) => !allowedKeys.includes(key));
    if (invalidKeys.length > 0) {
      throw new Error(
        `Недопустимый ключ/и в запросе: ${invalidKeys.join(", ")}`
      );
    }
    return true;
  }),

  body("email")
    .notEmpty()
    .isEmail()
    .withMessage("Строка должна быть емейлом и не пустой"),
  body("password")
    .notEmpty()
    .isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
    })
    .withMessage(
      "Пароль должен быть надежным более 6 символов, минимум 1 буква в нижнем и верхнем регистре и минимум 1 число"
    ),
];
export const authLoginValidation = [
  body().custom((value, { req }) => {
    const allowedKeys = ["email", "password"];
    const keys = Object.keys(req.body);
    const invalidKeys = keys.filter((key) => !allowedKeys.includes(key));
    if (invalidKeys.length > 0) {
      throw new Error(
        `Недопустимый ключ/и в запросе: ${invalidKeys.join(", ")}`
      );
    }
    return true;
  }),

  body("email")
    .notEmpty()
    .isEmail()
    .withMessage("Строка должна быть емейлом и не пустой"),
  body("password").notEmpty().withMessage("Пароль не должен быть пустым"),
];
