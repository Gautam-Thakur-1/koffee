import express from "express";
import { createChannel } from "../controllers/channel-controller";

const router = express.Router();

// @route POST /api/v1/channel/create
router.route("/create").post(createChannel);

export default router;
