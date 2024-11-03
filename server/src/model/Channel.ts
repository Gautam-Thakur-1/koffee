const mongoose = require("mongoose");

const channelSchema = new mongoose.schema(
  {
    Owners: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    canvas: {
      type: mongoose.schema.Types.ObjectId,
      ref: "Canvas",
    },
  },
  { timeStamp: true }
);

module.exports = mongoose.model("Channel", channelSchema);
