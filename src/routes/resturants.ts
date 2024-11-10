import express from "express";
import { param } from "express-validator";
import { getRestuant, searchRestuant } from "../controllers/resturants";

const router = express.Router();

router.get(
  "/:restuantId",
  param("restuantId")
    .isString()
    .notEmpty()
    .withMessage("Restuant Id must be required and string"),
  getRestuant
);

router.get(
  "/search/:city",
  param("city")
    .isString()
    .notEmpty()
    .withMessage("City must be required and string"),
  searchRestuant
);

export default router;
