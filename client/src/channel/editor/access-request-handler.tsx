import React from "react";
import { Socket } from "socket.io-client";
import ConnectAccessToast from "../../components/modal/connect-acccess-toast";
import { RequestType } from "./types";

interface AccessRequestHandlerProps {
  requests: RequestType[];
  socket: Socket | null;
  channelId: string;
  onRequestHandled: (userId: string) => void;
}

export const AccessRequestHandler: React.FC<AccessRequestHandlerProps> = ({
  requests,
  socket,
  channelId,
  onRequestHandled,
}) => {
  const handleAcceptRequest = (userId: string) => {
    socket?.emit("grant-access", { channelId, userId });
    onRequestHandled(userId);
  };

  const handleRejectRequest = (userId: string) => {
    socket?.emit("reject-access", { channelId, userId });
    onRequestHandled(userId);
  };

  return (
    <>
      {requests.map((request) => (
        <ConnectAccessToast
          key={request.userId}
          userName={request.userName}
          onAccept={() => handleAcceptRequest(request.userId)}
          onReject={() => handleRejectRequest(request.userId)}
        />
      ))}
    </>
  );
};
