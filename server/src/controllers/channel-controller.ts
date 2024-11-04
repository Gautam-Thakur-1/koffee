const Channel = require("../model/Channel");
import {Request, Response} from "express";

// @route POST /api/v1/channel/create
// @desc Create a channel

const createChannel = async (req:Request, res : Response) => {
  const { channelName, channelDescription } = req.body;

  try {
    
  } catch (error) {
    console.error("Error creating channel:", error);
    res.status(500).json({ error: error });
  }
};