import { Server } from "socket.io";

function initSocket(server: any) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  return io;
}

export default initSocket;
