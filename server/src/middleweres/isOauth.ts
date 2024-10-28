import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../model/User";
import CustomError from "../utils/customError";

export const isOauth = async (req: Request, res: Response,next:NextFunction) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return res.status(401).json({message: "Not authorized to access this route"});
        }
    if (!process.env.SECRET_KEY) {
        throw new Error("SECRET_KEY is not defined");
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("decoded",decoded);
    const user = await User.findById((decoded as jwt.JwtPayload)?.id);
    if (!user) {
        next(new CustomError("No user found with this id",401,false));
        
    }
        
    } catch (error) {
        console.log("error.......",error);
        return res.status(500).json({error: "error while generating token"});
    }
};