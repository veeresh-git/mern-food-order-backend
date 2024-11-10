import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resturant",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  deliveryDetails: {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    addressLine1: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },
  cartItems: [
    {
      menuItemId: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: String,
        required: true,
      },
    },
  ],
  totalAmount: Number,
  status: {
    type: String,
    enum: ["placed", "inProgress", "delivered", "paid", "outForDelivery"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", OrderSchema);

export default Order;
