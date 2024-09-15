import express from "express";
import {
  createUserController,
  updateUserController,
  getUserController,
} from "../controllers/user";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyUserRequest } from "../middleware/validation";

const router = express.Router();

router.get("/", jwtCheck, jwtParse, getUserController);
router.post("/", jwtCheck, createUserController);
router.put(
  "/",
  jwtCheck,
  jwtParse,
  validateMyUserRequest,
  updateUserController
);

export default router;
