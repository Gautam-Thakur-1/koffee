import express from "express";
import {
  userRegister,
  userLogin,
  specificUserDetails,
  checkLogin,
  userLogout,
} from "../controllers/user-controller";

const router = express.Router();

// @route POST api/v1/user/register
router.route("/register").post(userRegister);

// @route POST api/v1/user/login
router.route("/login").post(userLogin);

// @route GET api/v1/user/credential/:options
router.route("/credential/:options").get(specificUserDetails);

// @route GET api/v1/user/verify
router.route("/verify").get(checkLogin);

// @route POST api/v1/user/logout
router.route("/logout").post(userLogout);

export default router;
