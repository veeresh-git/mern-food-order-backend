import { Request, Response } from "express";
import Resturant, { MenuItemType } from "../models/resturant";
import Stripe from "stripe";
import Order from "../models/orderStatus";

type CheckoutSessionRequest = {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    city: string;
  };
  restaurantId: string;
};

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
const FRONTEND_URL = process.env.FRONTEND_URL as string;
const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;

export const stripeWebHookHandler = async (req: Request, res: Response) => {
  let event;

  try {
    const sig = req.headers["stripe-signature"];
    event = STRIPE.webhooks.constructEvent(
      req.body,
      sig as string,
      STRIPE_ENDPOINT_SECRET
    );
  } catch (error: any) {
    console.log(error);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const order = await Order.findById(event.data.object.metadata?.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.totalAmount = event.data.object.amount_total;
    order.status = "paid";

    await order.save();
  }

  res.status(200).send();
};

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const checkoutSessionRequest: CheckoutSessionRequest = req.body;
    const resturant = await Resturant.findById(
      checkoutSessionRequest.restaurantId
    );
    if (resturant) {
      const lineItems = createLineItems(
        checkoutSessionRequest,
        resturant.menueItems
      );

      const newOrder = new Order({
        restaurant: resturant,
        user: req.userId,
        status: "placed",
        deliveryDetails: checkoutSessionRequest.deliveryDetails,
        cartItems: checkoutSessionRequest.cartItems,
        createdAt: new Date(),
      });

      const session = await createSession(
        lineItems,
        resturant.deliveryPrice,
        resturant._id.toString(),
        newOrder._id.toString()
      );
      if (session.url) {
        await newOrder.save();
        res.json({ url: session.url });
      } else {
        res.status(500).json({ message: "Error creating stripe session!" });
      }
    } else {
      res.status(404).json({ message: "Resturant not found!" });
    }
  } catch (e: any) {
    console.log(e);
    res.status(500).json({ message: e.raw.message });
  }
};

const createLineItems = (
  checkoutSessionRequest: CheckoutSessionRequest,
  menueItems: MenuItemType[]
) => {
  const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
    const foundItem = menueItems.find(
      (menueItem) => menueItem._id.toString() === cartItem.menuItemId.toString()
    );
    if (foundItem) {
      const line_item: Stripe.Checkout.SessionCreateParams.LineItem = {
        price_data: {
          currency: "gbp",
          unit_amount: foundItem.price,
          product_data: {
            name: foundItem.name,
          },
        },
        quantity: parseInt(cartItem.quantity),
      };
      return line_item;
    } else {
      throw new Error(`Menu item not found: ${cartItem.menuItemId}`);
    }
  });
  return lineItems;
};

const createSession = async (
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  deliveryPrice: Number,
  restaurantId: string,
  orderId: string
) => {
  const sessionData = await STRIPE.checkout.sessions.create({
    line_items: lineItems,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Delivery",
          type: "fixed_amount",
          fixed_amount: {
            amount: deliveryPrice as number,
            currency: "gbp",
          },
        },
      },
    ],
    mode: "payment",
    metadata: {
      orderId,
      restaurantId,
    },
    success_url: `${FRONTEND_URL}/order-status?success=true`,
    cancel_url: `${FRONTEND_URL}/detail/${restaurantId}?cancelled=true`,
  });

  return sessionData;
};
