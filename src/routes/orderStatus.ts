import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import {
  createCheckoutSession,
  stripeWebHookHandler,
  getMyOrders,
} from "../controllers/orderStatus";

const router = express.Router();

router.get("/", jwtCheck, jwtParse, getMyOrders);

router.post(
  "/checkout/create-checkout-session",
  jwtCheck,
  jwtParse,
  createCheckoutSession
);

router.post("/checkout/webhook", stripeWebHookHandler);

export default router;
