import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  } else {
    next();
  }
};

export const validateMyUserRequest = [
  body("name").isString().notEmpty().withMessage("Name must be a string"),
  body("addressLine1")
    .isString()
    .notEmpty()
    .withMessage("AddressLine1 must be a string"),
  body("city").isString().notEmpty().withMessage("City must be a string"),
  body("country").isString().notEmpty().withMessage("Country must be a string"),
  handleValidationErrors,
];

export const validateMyResturantRequest = [
  body("resturantName")
    .isString()
    .notEmpty()
    .withMessage("Resturant Name must be a string"),
  body("city").isString().notEmpty().withMessage("City must be a string"),
  body("country").isString().notEmpty().withMessage("Country must be a string"),
  body("deliveryPrice")
    .isFloat({ min: 0 })
    .withMessage("Delivery price must be a positive number"),
  body("estimatedDeliveryTime")
    .isInt({ min: 0 })
    .withMessage("Estimated deliveryTime must be a positive number"),
  body("cuisines")
    .isArray()
    .withMessage("Cuisines must be an arrya")
    .not()
    .isEmpty()
    .withMessage("Cuisines arrya cannot be empty"),
  body("menueItems").isArray().withMessage("Menue items must be an arrya"),
  body("menueItems.*.name")
    .notEmpty()
    .withMessage("Menue name must be a string"),
  body("menueItems.*.price")
    .isFloat({ min: 0 })
    .withMessage("Menue price must be a positive number"),
  handleValidationErrors,
];
