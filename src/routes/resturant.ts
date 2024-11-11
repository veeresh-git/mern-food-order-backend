import express from "express";
import multer from "multer";
import {
  createResturantController,
  getResturantController,
  updateResturantController,
  updateOrderStatus,
  getMyRestaurantOrders,
} from "../controllers/resturant";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyResturantRequest } from "../middleware/validation";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5mb
  },
});

router.patch("/order/:orderId/status", jwtCheck, jwtParse, updateOrderStatus);

router.get("/order", jwtCheck, jwtParse, getMyRestaurantOrders);

router.post(
  "/",
  upload.single("imageFile"),
  validateMyResturantRequest,
  jwtCheck,
  jwtParse,
  createResturantController
);

router.get("/", jwtCheck, jwtParse, getResturantController);

router.put(
  "/",
  upload.single("imageFile"),
  validateMyResturantRequest,
  jwtCheck,
  jwtParse,
  updateResturantController
);

export default router;
