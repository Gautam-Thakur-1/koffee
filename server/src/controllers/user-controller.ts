import User from "../model/User";
import { Request, Response } from "express";
import { generateAccessToken } from "../utils/generateAccessToken";
import jwt from "jsonwebtoken";
import sendToken from "../utils/jwtToken";

// @route POST /api/v1/user/register
// @desc Register user

export const userRegister = async (req: Request, res: Response) => {
  try {
    const { name, userName, email, password, avatar } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    const userNameExistence = await User.findOne({ userName });
    if (userNameExistence) {
      return res.status(400).json({ msg: "Username already exists" });
    }
    user = await User.create({
      name,
      email,
      userName,
      password,
      avatar,
    });
    return res.status(201).json({
      msg: "User created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

// @route POST /api/v1/user/login
// @desc Login user

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, userName, password } = req.body;
    if (!email && !userName) {
      return res
        .status(400)
        .json({ message: "email or username is required", success: false });
    }
    if (!password) {
      return res
        .status(400)
        .json({ message: "password is required", success: false });
    }
    const user = await User.findOne({
      $or: [{ email: email }, { userName: userName }],
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User Not Found", success: false });
    }
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Invalid Password", success: false });
    }
    const accessToken = await generateAccessToken(user?._id);
    const loggedInUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      userName: user.userName,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
      // accessToken,
    };

    // use send token function to send the token
    sendToken(user, accessToken, res, loggedInUser);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server Error", success: false, error: error });
  }
};

// @route GET /api/v1/credential/:{emailId or userName}
// @desc Get user by emailId or userName

export const specificUserDetails = async (req: Request, res: Response) => {
  try {
    const { options } = req.params;
    const user = await User.findOne({
      $or: [{ email: options }, { userName: options }],
    }).select("-password ");
    if (!user) {
      return res
        .status(400)
        .json({ message: "user not found", success: false });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server Error", success: false, error: error });
  }
};

// @route GET /api/v1/user/verify
// @desc Check if user is logged in

export const checkLogin = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized to access this route" });
    }
    if (!process.env.SECRET_KEY) {
      throw new Error("SECRET_KEY is not defined");
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({
        message: "Not authorized to access this route",
        success: false,
      });
    }
    return res
      .status(200)
      .json({ success: true, data: decoded, message: "User is logged in" });
  } catch (error) {
    console.log("error.......", error);
    return res.status(500).json({ error: "error while generating token" });
  }
};

// @route Post /api/v1/user/logout
// @desc Logout user

export const userLogout = async (req: Request, res: Response) => {
  try {
    const { email, userName } = req.body;
    if (!email && !userName) {
      return res
        .status(400)
        .json({ message: "email or username is required", success: false });
    }
    const user = await User.findOne({
      $or: [{ email: email }, { userName: userName }],
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "user not found", success: false });
    }
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.status(200).json({
      success: true,
      data: {},
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server Error", success: false, error: error });
  }
};
