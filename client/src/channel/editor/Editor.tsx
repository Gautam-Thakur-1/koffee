import React from "react";
import { useLocation } from "react-router-dom";
import { EditorContent } from "@tiptap/react";
import toast from "react-hot-toast";
import { useSocket } from "./hooks/use-socket";
import { useCollaborativeEditor } from "./hooks/use-collaborative-Editor";
import { AccessRequestHandler } from "./access-request-handler";
import ChannelNav from "../channel-nav";
import ConnectionStatusPage from "../connection-status-page";

interface EditorProps {
  channelId: string;
  userId: string;
}

const Editor: React.FC<EditorProps> = ({ channelId, userId }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const connectionType = queryParams.get("type");

  const {
    socket,
    error,
    connectionStatus,
    userAccessRequests,
    setUserAccessRequests,
  } = useSocket(channelId, userId, connectionType);

  const { editor, ydoc, handleUpdate, handleInitialState, updateHandler } =
    useCollaborativeEditor(socket);

  React.useEffect(() => {
    if (!socket || !editor) return;

    socket.on("sync-canvas", handleInitialState);
    socket.on("update-canvas", handleUpdate);
    ydoc.on("update", updateHandler);

    return () => {
      socket.off("sync-canvas");
      socket.off("update-canvas");
      ydoc.off("update", updateHandler);
    };
  }, [editor, socket, ydoc, handleInitialState, handleUpdate, updateHandler]);

  if (!editor) {
    return error ? <div>{toast.error(error)}</div> : null;
  }

  const handleRequestHandled = (userId: string) => {
    setUserAccessRequests((prevRequests) =>
      prevRequests.filter((request) => request.userId !== userId)
    );
  };

  return (
    <div className="w-full h-full">
      <div className="w-full fixed top-0">
        <ChannelNav connectionStatus={connectionStatus} />
      </div>

      {connectionStatus !== "connected" && (
        <ConnectionStatusPage connectionStatus={connectionStatus} />
      )}

      {connectionStatus === "connected" && (
        <div className="p-4 w-full h-full mt-12 max-w-xl mx-auto">
          <EditorContent editor={editor} />
        </div>
      )}

      <AccessRequestHandler
        requests={userAccessRequests}
        socket={socket}
        channelId={channelId}
        onRequestHandled={handleRequestHandled}
      />
    </div>
  );
};

export default Editor;
