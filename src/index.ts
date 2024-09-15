import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoutes from "./routes/user";

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connected to database!"))
  .catch(() => console.log("Failed to connect to database"));

const app = express();

app.use(express.json());
app.use(cors());

app.use("/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "Health ok!" });
});

app.use("/api/my/user", myUserRoutes);

app.listen(3002, () => console.log("Server started at port 3002"));
