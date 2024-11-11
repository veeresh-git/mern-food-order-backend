import { Request, Response } from "express";
import Resturant from "../models/resturant";
import mongoose from "mongoose";
import cloudinary from "cloudinary";
import Order from "../models/orderStatus";

export const createResturantController = async (
  req: Request,
  res: Response
) => {
  try {
    const existingResturant = await Resturant.findOne({ user: req.userId });
    if (existingResturant) {
      res.status(409).json({ message: "User resturant already exists!" });
    } else {
      const imageUrl = await uploadImage(req.file as Express.Multer.File);

      const resturant = new Resturant(req.body);
      resturant.user = new mongoose.Types.ObjectId(req.userId);
      resturant.imageUrl = imageUrl;
      resturant.lastUpdated = new Date();
      await resturant.save();
      res.status(201).json(resturant);
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Error creating resturant!",
    });
  }
};

export const getResturantController = async (req: Request, res: Response) => {
  try {
    const existingResturant = await Resturant.findOne({ user: req.userId });
    if (existingResturant) {
      res.status(200).json(existingResturant.toObject());
    } else {
      res.status(401).json({ message: "User resturant not exists!" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Error getting resturant!",
    });
  }
};

export const updateResturantController = async (
  req: Request,
  res: Response
) => {
  try {
    const existingResturant = await Resturant.findOne({ user: req.userId });
    if (!existingResturant) {
      res.status(401).json({ message: "User resturant not exists!" });
    } else {
      existingResturant.resturantName = req.body.resturantName;
      existingResturant.city = req.body.city;
      existingResturant.country = req.body.country;
      existingResturant.deliveryPrice = req.body.deliveryPrice;
      existingResturant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
      existingResturant.cuisines = req.body.cuisines;
      existingResturant.menueItems = req.body.menueItems;
      existingResturant.lastUpdated = new Date();

      if (req.file) {
        const imageUrl = await uploadImage(req.file as Express.Multer.File);
        existingResturant.imageUrl = imageUrl;
      }

      await existingResturant.save();
      res.status(200).json(existingResturant);
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Error updating resturant!",
    });
  }
};

const uploadImage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;

  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
  return uploadResponse.url;
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "order not found" });
    }

    const restaurant = await Resturant.findById(order.restaurant);

    if (restaurant?.user?._id.toString() !== req.userId) {
      return res.status(401).send();
    }

    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "unable to update order status" });
  }
};
