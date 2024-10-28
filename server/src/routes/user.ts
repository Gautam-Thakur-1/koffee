import express from "express";
import { userRegister } from "../controllers/user";
import { userLogin } from "../controllers/user";
import { specificUserDetails } from "../controllers/user";
import { checkLogin } from "../controllers/user";
import { userLogout } from "../controllers/user";


const router = express.Router();

// @route POST api/v1/user/register
router.route("/register").post(userRegister);

// @route POST api/v1/user/login
router.route("/login").post(userLogin);

// @route GET api/v1/user/specificUserDetails/:options
router.route("/:options").get(specificUserDetails);

// @route GET api/v1/user/checkLogin
router.route("/check-login").get(checkLogin);

// @route POST api/v1/user/logout
router.route("/logout").post(userLogout);


export default router;