const mongoose = require("mongoose");

const channelSchema = new mongoose.schema(
  {
    organizer: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    channelName: {
      type: String,
      required: true,
    },
    channelDescription: {
      type: String,
      required: false,
    },
    accessTokens : [{
      type: String,
      required: true,
    }],
    canvas: {
      type: mongoose.schema.Types.ObjectId,
      ref: "Canvas",
    },
  },
  { timeStamp: true }
);

module.exports = mongoose.model("Channel", channelSchema);
