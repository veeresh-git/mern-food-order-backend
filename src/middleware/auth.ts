import { auth } from "express-oauth2-jwt-bearer";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

declare global {
  namespace Express {
    interface Request {
      userId: string;
      auth0Id: string;
    }
  }
}

export const jwtCheck = auth({
  audience: "mern-food-order-api",
  issuerBaseURL: "https://dev-eddwjhkbhlud6eqn.us.auth0.com/",
  tokenSigningAlg: "RS256",
});

export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.sendStatus(401);
  } else {
    const token = authorization.split(" ")[1];
    try {
      const decoded = jwt.decode(token) as jwt.JwtPayload;
      const user = await User.findOne({ auth0Id: decoded.sub });
      if (!user) {
        res.sendStatus(401);
      }
      req.auth0Id = decoded.sub as string;
      req.userId = user?._id.toString() as string;
      next();
    } catch (error) {
      console.log(error);
      res.sendStatus(401);
    }
  }
};
