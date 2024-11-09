import express from "express";
import { param } from "express-validator";
import { searchRestuant } from "../controllers/resturants";

const router = express.Router();

router.get(
  "/search/:city",
  param("city")
    .isString()
    .notEmpty()
    .withMessage("City must be required and string"),
  searchRestuant
);

export default router;
