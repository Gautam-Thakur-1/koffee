const Y = require("yjs");
const Canvas = require("../model/Canvas");
const Channel = require("../model/Channel");
import User from "../model/User";
import { decodeUpdate, encodeUpdate } from "../utils/helper";

// Admin socketId to userId map
const adminSocketIdMap = new Map();

// Access Request userId to channelId map
const accessRequestMap = new Map();

// Cache Map
const activeCanvas = new Map();

function socketEvents(io: any) {
  io.on("connection", (socket: any) => {
    console.log("User connected", socket.id);

    console.log(adminSocketIdMap);

    socket.on(
      "connect-channel",
      async (data: { channelId: string; userId: string }) => {
        const { channelId, userId } = data;
        try {
          const channel = await Channel.findOne({ channelId });

          if (!channel) {
            return socket.emit("error", "Channel not found");
          }

          const organizerId = channel.organizer.toString();
          const isAdmin = organizerId === userId;

          // Map the admin socketId to userId
          if (isAdmin) {
            adminSocketIdMap.set(userId, socket.id);
          }

          const isMemberAlreadyInChannel =
            channel.connectedMembersId.includes(userId);

          if (!isMemberAlreadyInChannel) {
            // Deny access if not an admin and not a member of the channel
            if (!isAdmin) {
              return socket.emit("error", "You are not allowed to join");
            }
          }

          console.log("User joined channel", channelId);

          // Join the channel room
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
          1;
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
            console.log("User disconnected", socket.id);

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
      }
    );

    socket.on(
      "request-access",
      async (data: { channelId: string; userId: string }) => {
        const { channelId, userId } = data;

        const channel = await Channel.findOne({ channelId });

        console.log("Request access", socket.id, userId);

        if (!channel) {
          return socket.emit("error", "Channel not found");
        }

        const user = await User.findById(userId);

        if (!user) {
          return socket.emit("error", "User not found");
        }

        accessRequestMap.set(userId, channelId);

        console.log(accessRequestMap);

        const organizerId = channel.organizer.toString();
        const isAdmin = organizerId === userId;

        if (isAdmin) {
          socket.emit("grant-access");
        }

        const isMemberAlreadyInChannel =
          channel.connectedMembersId.includes(userId);

        if (isMemberAlreadyInChannel) {
          return socket.emit("grant-access");
        }

        if (!isMemberAlreadyInChannel || !isAdmin) {
          // send request to admin
          const adminSocketId = adminSocketIdMap.get(organizerId);

          if (!adminSocketId) {
            return socket.emit("error", "Admin not found");
          }

          socket.to(adminSocketId).emit("user-access-request", {
            userId,
            userName: user.name,
          });
        }
      }
    );

    socket.on(
      "grant-access",
      async (data: { channelId: string; userId: string }) => {
        try {
          const { channelId, userId } = data;

          if (!channelId || !userId) {
            return socket.emit("error", "Invalid request");
          }

          const channel = await Channel.findOne({ channelId });

          if (!channel) {
            return socket.emit("error", "Channel not found");
          }

          if (!channel.connectedMembersId.includes(userId)) {
            channel.connectedMembersId.push(userId);
            await channel.save();
          }

          console.log("Access granted to", userId);

          socket
            .to(accessRequestMap.get(userId))
            .emit("access-granted", "Connect to channel");

          accessRequestMap.delete(userId);

          socket.emit(
            "channel-members",
            io.sockets.adapter.rooms.get(channelId)?.size
          );
        } catch (error) {
          console.error("ERROR_GRANT_ACCESS", error);
          socket.emit("error", "Failed to grant access");
        }
      }
    );

    socket.on(
      "reject-access",
      async (data: { channelId: string; userId: string }) => {
        const { channelId, userId } = data;

        socket
          .to(accessRequestMap.get(userId))
          .emit("access-denied", "Access denied");
        accessRequestMap.delete(userId);

        console.log("Access denied to", socket.id, userId);
      }
    );
  });
}

export default socketEvents;
