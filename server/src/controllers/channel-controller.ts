const Channel = require("../model/Channel");
import { Request, Response } from "express";

// @route POST /api/v1/channel/create
// @desc Create a channel

export const createChannel = async (req: Request, res: Response) => {
  const { channelName, channelDescription, organizerId, channelId } = req.body;

  try {
    if (!channelName || !organizerId || !channelDescription) {
      return res.status(400).json({ error: "Missing details" });
    }

    const newChannel = new Channel({
      channelId,
      channelName,
      channelDescription,
      organizer: organizerId,
      connectedMembersId: [organizerId],
    });

    await newChannel.save();
    res
      .status(201)
      .json({ channel: newChannel, message: "Channel created successfully" });
  } catch (error) {
    console.error("Error creating channel:", error);
    res.status(500).json({ error: error });
  }
};

// @route GET /api/v1/channel/:channelId
// @desc Get a channel by id

export const getChannelById = async (req: Request, res: Response) => {
  const { channelId } = req.params;

  try {
    const channel = await Channel.findOne({ channelId });

    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    res.status(200).json({ channel });
  } catch (error) {
    console.error("Error getting channel:", error);
    res.status(500).json({ error });
  }
};
