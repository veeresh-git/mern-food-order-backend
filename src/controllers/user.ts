import { Request, Response } from "express";
import User from "../models/user";

const getUserController = async (req: Request, res: Response) => {
  try {
    const existingUser = await User.findById(req.userId);
    if (!existingUser) {
      res.status(404).json({
        message: "User not found!",
      });
    } else {
      res.status(200).json(existingUser.toObject());
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Error getting user!",
    });
  }
};

const createUserController = async (req: Request, res: Response) => {
  try {
    const { auth0Id } = req.body;
    const existingUser = await User.findOne({ auth0Id });
    if (existingUser) {
      res.status(200).send();
    } else {
      const newUser = new User(req.body);
      newUser.save();
      res.status(201).json(newUser.toObject());
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Error creating user!",
    });
  }
};

const updateUserController = async (req: Request, res: Response) => {
  try {
    const { name, addressLine1, city, country } = req.body;
    const existingUser = await User.findById(req.userId);
    if (!existingUser) {
      res.status(404).json({
        message: "User not found!",
      });
    } else {
      existingUser.name = name;
      existingUser.addressLine1 = addressLine1;
      existingUser.city = city;
      existingUser.country = country;
      existingUser.save();
      res.status(200).json(existingUser.toObject());
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Error updating user!",
    });
  }
};

export { createUserController, updateUserController, getUserController };
