const Y = require("yjs");
const Canvas = require("../model/Canvas");

// Cache Map
const activeCanvas = new Map();

// Function to encode Uint8Array to base64
function encodeUpdate(update: any) {
  return Buffer.from(update).toString("base64");
}

// Function to decode base64 to Uint8Array
function decodeUpdate(update: any) {
  if (typeof update === "string") {
    return Uint8Array.from(Buffer.from(update, "base64"));
  } else {
    console.warn("Received non-string update for decoding:", update);
    throw new TypeError("Expected a base64-encoded string for update");
  }
}

function socketEvents(io: any) {
  io.on("connection", (socket: any) => {
    console.log("User connected", socket.id);

    socket.on("join-channel", async (channelId: string) => {
      try {
        socket.join(channelId);

        // Emit the number of members in the channel
        socket
          .to(channelId)
          .emit(
            "channel-members",
            io.sockets.adapter.rooms.get(channelId)?.size
          );

        // Retrieve or create canvas
        let canvas = await Canvas.findOne({ channelId });
        if (!canvas) {
          const yDoc = new Y.Doc();
          const initialContent = Y.encodeStateAsUpdate(yDoc);
          canvas = await Canvas.create({
            channelId,
            content: Buffer.from(initialContent),
          });
        }

        // Initialize Yjs document for channel if not in activeCanvas cache
        if (!activeCanvas.has(channelId)) {
          const yDoc = new Y.Doc();
          Y.applyUpdate(yDoc, canvas.content); // Apply stored state
          activeCanvas.set(channelId, yDoc);
        }

        const yDoc = activeCanvas.get(channelId);

        // Send the latest state to the client, encoded as base64
        socket.emit("sync-canvas", encodeUpdate(Y.encodeStateAsUpdate(yDoc)));

        // Handle canvas updates from the client
        socket.on("update-canvas", async (update: any) => {
          try {
            const updateArray = decodeUpdate(update); // Decode the base64 string to Uint8Array
            Y.applyUpdate(yDoc, updateArray);

            // Persist the updated content in the database
            await Canvas.findOneAndUpdate(
              { channelId },
              { content: Buffer.from(Y.encodeStateAsUpdate(yDoc)) }
            );

            // Broadcast the update to other users in the channel, encoded as base64
            socket
              .to(channelId)
              .emit("update-canvas", encodeUpdate(updateArray));
          } catch (error) {
            console.error("SERVER-SOCKET_ERROR_UPDATE_CANVAS", error);
          }
        });

        // Handle disconnect and cleanup
        socket.on("disconnect", async () => {
          const remainingClients =
            io.sockets.adapter.rooms.get(channelId)?.size || 0;

          // Update the channel member count
          socket.to(channelId).emit("channel-members", remainingClients);

          // If no clients are connected, save and remove document from cache
          if (remainingClients === 0) {
            const finalState = Y.encodeStateAsUpdate(yDoc);

            await Canvas.findOneAndUpdate(
              { channelId },
              { content: Buffer.from(finalState), updatedAt: new Date() }
            );

            activeCanvas.delete(channelId);
          }
        });
      } catch (error) {
        console.error("ERROR_JOINING_CHANNEL", error);
        socket.emit("error", "Failed to join Channel");
      }
    });
  });
}

export default socketEvents;
