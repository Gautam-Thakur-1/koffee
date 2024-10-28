import User from "../model/User";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const userRegister = async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        const { name, email, password } = req.body;
        if (!name || !email  || !password) {
            return res.status(400).json({ msg: "Please enter all fields" });
        }
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }
        user = new User({
            name,
            email,
            password,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
}
