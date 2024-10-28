import express from "express";
import { userRegister } from "../controllers/user";

const router = express.Router();

// @route POST api/v1/user/register
router.route("/register").post(userRegister);


export default router;