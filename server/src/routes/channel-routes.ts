import express from "express";
import { createChannel, getChannelById } from "../controllers/channel-controller";

const router = express.Router();

// @route POST /api/v1/channel/create
router.route("/create").post(createChannel);

// @route GET /api/v1/channel/:channelId
router.route("/:channelId").get(getChannelById);

export default router;
