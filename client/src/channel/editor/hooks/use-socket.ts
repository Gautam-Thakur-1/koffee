import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ConnectionStatusType, RequestType } from "../types";
import useActiveUserStore from "../../../stores/useActiveUserStore";

export const useSocket = (
  channelId: string,
  userId: string,
  connectionType: string | null
) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatusType>("waiting");
  const [userAccessRequests, setUserAccessRequests] = useState<RequestType[]>(
    []
  );

  const { activeConnectedUsers, setActiveConnectedUsers } =
    useActiveUserStore();

  const navigate = useNavigate();

  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_SERVER_URL}`, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      if (connectionType === "connect") {
        socket.emit("connect-channel", { channelId, userId });
        setConnectionStatus("connected");
      } else if (connectionType === "request-access") {
        socket.emit("request-access", { channelId, userId });
        setConnectionStatus("waiting");
      } else {
        setError("Invalid connection type");
      }
    });

    socket.on("sync-members", (members) => {
      setActiveConnectedUsers(members);
    });

    socket.on("access-granted", () => {
      setConnectionStatus("connected");
      toast.success("Connected to channel", { duration: 3000 });
      navigate(`/channel/${channelId}?type=connect`, { replace: true });

      setTimeout(() => {
        socket.emit("connect-channel", { channelId, userId });
      }, 100);
    });

    socket.on("access-denied", () => {
      setConnectionStatus("denied");
      toast.error("Access denied", { duration: 3000 });
      socket.disconnect();
      setTimeout(() => {
        navigate("/user/dashboard", { replace: true });
      }, 1000);
    });

    socket.on("user-access-request", ({ userId, userName }) => {
      setUserAccessRequests((requests) => {
        const userExists = requests.some((req) => req.userId === userId);
        return userExists ? requests : [...requests, { userId, userName }];
      });
    });

    socket.on("error", setError);
    socket.on("disconnect", () => setConnectionStatus("waiting"));

    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, [channelId, userId, connectionType, navigate]);

  return {
    socket,
    error,
    connectionStatus,
    userAccessRequests,
    setUserAccessRequests,
    activeConnectedUsers,
  };
};
