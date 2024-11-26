const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema(
  {
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    channelId: {
      type: String,
      required: true,
    },
    channelName: {
      type: String,
      required: true,
    },
    channelDescription: {
      type: String,
    },
    connectedMembersId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    canvas: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Canvas",
    },
  },
  { timeStamp: true }
);

module.exports = mongoose.model("Channel", channelSchema);
