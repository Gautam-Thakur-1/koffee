import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../model/User";
import CustomError from "../utils/customError";



let userRole: string;
let matchUser:any;

export const isOauth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized to access this route" });
    }
    if (!process.env.SECRET_KEY) {
      throw new Error("SECRET_KEY is not defined");
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("decoded", decoded);
    const user = await User.findById((decoded as jwt.JwtPayload)?.id).select("-password");
    if (!user) {
      next(new CustomError("No user found with this id", 401, false));
    }
    user.isAdmin ? (userRole = "admin") : (userRole = "user");
    matchUser = user._id;
    (req as any).user = user;
    next();
  } catch (error) {
    console.log("error.......", error);
    return res.status(500).json({ error: "error while generating token" });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!roles.includes(userRole)) {
      next(new CustomError("You are not authorized", 403, false));
    }
    next();
  };
};

export const authorizeUser = (req: any, res: Response ) => {
    if (!req.body.userId) {
        return res.status(400).json({ message: "User Id is required" });
    }
  
  return matchUser;
};
