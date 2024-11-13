const Y = require("yjs");
const mongoose = require("mongoose");

const canvasSchema = new mongoose.Schema(
  {
    canvasName: {
      type: String,
      default: "Untitled",
    },
    channelId: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: Buffer,
      required: true,
      default: () => {
        const ydoc = new Y.Doc();
        return Buffer.from(Y.encodeStateAsUpdate(ydoc));
      },
    },
    isPublic: { type: Boolean, default: false },
    isPending: { type: Boolean, default: true },
  },
  { timeStamp: true }
);

module.exports = mongoose.model("Canvas", canvasSchema);
