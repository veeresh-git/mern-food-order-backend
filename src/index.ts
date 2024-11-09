import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoutes from "./routes/user";
import myResturantRoutes from "./routes/resturant";
import ResturantRoutes from "./routes/resturants";
import { v2 as cloudinary } from "cloudinary";

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connected to database!"))
  .catch(() => console.log("Failed to connect to database"));

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(express.json());
app.use(cors());

app.use("/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "Health ok!" });
});

app.use("/api/my/user", myUserRoutes);
app.use("/api/my/resturant", myResturantRoutes);
app.use("/api/restaurant", ResturantRoutes);

app.listen(3002, () => console.log("Server started at port 3002"));
