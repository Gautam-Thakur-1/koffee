const Y = require("yjs");
const Canvas = require("../model/Canvas");
const Channel = require("../model/Channel");
import User from "../model/User";
import { decodeUpdate, encodeUpdate } from "../utils/helper";

// Admin socketId to userId map
const adminSocketIdMap = new Map();

// Access Request userId to channelId map
const accessRequestMap = new Map();

// Map to store connected users with their socketId and userName
const activeConnectedUsers = new Map<
  string,
  { socketId: string; userName: string }
>();

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

          const user = await User.findById(userId);

          if (!user) {
            return socket.emit("error", "User not found");
          }

          activeConnectedUsers.set(userId, {
            socketId: socket.id,
            userName: user.name,
          });

          // Emit the list of connected users
          socket.emit(
            "sync-members",
            Array.from(activeConnectedUsers.values())
          );

          console.log(activeConnectedUsers);

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

            // Remove user from activeConnectedUsers map
            const user = activeConnectedUsers.get(userId);
            if (user?.socketId === socket.id) {
              activeConnectedUsers.delete(userId);
            }

            socket.emit(
              "sync-members",
              Array.from(activeConnectedUsers.values())
            );

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
      "cursor-update",
      (data: {
        channelId: string;
        cursor: {
          from: number;
          to: number;
        };
        user: {
          name: string;
          color: string;
        };
      }) => {
        if (!data.user || !data.user.color) {
          console.error("Invalid user data received:", data);
          return;
        }

        socket.broadcast.emit("remote-cursor", data);
        console.log("Cursor update", data);
      }
    );

    socket.on(
      "highlight-update",
      (data: {
        channelId: string;
        highlight: {
          user: {
            name: string;
            color: string;
          };
          from: number;
          to: number;
        };
      }) => {

        if (!data.highlight.user || !data.highlight.user.color) {
          console.error("Invalid user data received:", data);
          return;
        }

        socket.broadcast.emit("remote-highlight", data.highlight);

        console.log("Highlight update", data);
      }
    )

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

        // Store socket.id instead of channelId
        accessRequestMap.set(userId, socket.id);

        const organizerId = channel.organizer.toString();
        const isAdmin = organizerId === userId;

        if (isAdmin) {
          socket.emit("access-granted");
          return;
        }

        const isMemberAlreadyInChannel =
          channel.connectedMembersId.includes(userId);

        if (isMemberAlreadyInChannel) {
          socket.emit("access-granted");
          return;
        }

        // Send request to admin
        const adminSocketId = adminSocketIdMap.get(organizerId);

        if (!adminSocketId) {
          return socket.emit("error", "Admin not found");
        }

        io.to(adminSocketId).emit("user-access-request", {
          userId,
          userName: user.name,
        });
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

          // Get requesting user's socket ID
          const requestingSocketId = accessRequestMap.get(userId);

          if (requestingSocketId) {
            // Emit directly to the requesting socket
            io.to(requestingSocketId).emit(
              "access-granted",
              "Connect to channel"
            );
            accessRequestMap.delete(userId);
          }

          // Add user to active connected users
          const user = await User.findById(userId);
          activeConnectedUsers.set(userId, {
            socketId: requestingSocketId,
            userName: user.name,
          });

          // Update channel members count
          const roomSize = io.sockets.adapter.rooms.get(channelId)?.size || 0;
          io.to(channelId).emit("channel-members", roomSize);
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

        const requestingSocketId = accessRequestMap.get(userId);
        if (requestingSocketId) {
          io.to(requestingSocketId).emit("access-denied", "Access denied");
          accessRequestMap.delete(userId);
        }

        console.log("Access denied to", socket.id, userId);
      }
    );
  });
}

export default socketEvents;
