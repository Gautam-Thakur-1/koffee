import { useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

import * as Y from "yjs";

import { Editor as TipTapEditor } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import Collaboration from "@tiptap/extension-collaboration";
import StarterKit from "@tiptap/starter-kit";

import { decodeUpdate, encodeUpdate } from "../lib/editor-helper";
import WaitingPage from "./waiting-page";
import ChannelNav from "./channel-nav";
import toast from "react-hot-toast";
import ConnectAccessToast from "../components/modal/connect-acccess-toast";

type RequestType = {
  userId: string;
  userName: string;
};

const Editor = ({
  channelId,
  userId,
}: {
  channelId: string;
  userId: string;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [ydoc] = useState(() => new Y.Doc());
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "waiting"
  >("waiting");
  const [isInitialized, setIsInitialized] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const connectionType = queryParams.get("type");

  // Only for admin
  const [userAccessRequests, setUserAccessRequests] = useState<RequestType[]>(
    []
  );
  const [isUserAccessRequestOpen, setIsUserAccessRequestOpen] = useState(false);

  const handleEditorCreate = useCallback(
    ({ editor }: { editor: TipTapEditor }) => {
      if (!isInitialized) {
        console.log("Setting initial content");
        editor.commands.setContent("");
        setIsInitialized(true);
      }
    },
    [isInitialized]
  );

  const handleDocUpdate = useCallback(() => {
    if (!socket) return;
    const update = Y.encodeStateAsUpdate(ydoc);
    const encodedUpdate = encodeUpdate(update);
    socket.emit("update-canvas", encodedUpdate);
  }, [socket, ydoc]);

  const handleUpdate = useCallback(
    (update: string) => {
      try {
        const updateArray = decodeUpdate(update);
        Y.applyUpdate(ydoc, updateArray);
      } catch (error) {
        console.error("Error applying update:", error);
      }
    },
    [ydoc]
  );

  const handleInitialState = useCallback(
    (initialState: string) => {
      try {
        const stateArray = decodeUpdate(initialState);
        Y.applyUpdate(ydoc, stateArray);
      } catch (error) {
        console.error("Error applying initial state:", error);
      }
    },
    [ydoc]
  );

  const updateHandler = useCallback(
    (update: Uint8Array) => {
      if (!socket || update.byteLength === 0) return;
      const encodedUpdate = encodeUpdate(update);
      socket.emit("update-canvas", encodedUpdate);
    },
    [socket]
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Collaboration.configure({
        document: ydoc,
        field: "content",
      }),
    ],
    onCreate: handleEditorCreate,
    onUpdate: handleDocUpdate,
    editorProps: {
      attributes: {
        class:
          "h-full mx-auto focus:outline-none prose prose-sm sm:prose lg:prose-lg",
      },
    },
  });

  useEffect(() => {
    const s = io(`${import.meta.env.VITE_SERVER_URL}`, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    s.on("connect", () => {
      console.log("Socket connected");

      if (connectionType === "connect") {
        s.emit("connect-channel", { channelId, userId });
        setConnectionStatus("connected");
      } else if (connectionType === "request-access") {
        s.emit("request-access", { channelId, userId });
        setConnectionStatus("waiting");
      } else {
        setError("Invalid connection type");
      }
    });

    s.on("grant-access", () => {
      setConnectionStatus("connected");
      s.emit("connect-channel", { channelId, userId });
    });

    s.on("user-access-request", ({ userId, userName }) => {
      setUserAccessRequests((requests) => {
        const userExists = requests.some((req) => req.userId === userId);
        return userExists ? requests : [...requests, { userId, userName }];
      });
      setIsUserAccessRequestOpen(true);
    });

    s.on("error", (error) => {
      setError(error);
    });

    s.on("disconnect", () => {
      setConnectionStatus("waiting");
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [channelId, userId, connectionType]);

  useEffect(() => {
    if (!socket || !editor) return;

    socket.on("channel-members", (members) => {
      console.log("Channel members:", members);
    });

    socket.on("sync-canvas", handleInitialState);
    socket.on("update-canvas", handleUpdate);
    ydoc.on("update", updateHandler);

    return () => {
      socket.off("channel-members");
      socket.off("sync-canvas");
      socket.off("update-canvas");
      ydoc.off("update", updateHandler);
    };
  }, [editor, socket, ydoc, handleInitialState, handleUpdate, updateHandler]);

  const handleAcceptRequest = (userId: string) => {
    setUserAccessRequests((requests) =>
      requests.filter((r) => r.userId !== userId)
    );

    setIsUserAccessRequestOpen(false);
    socket?.emit("grant-access", { channelId, userId });
  };

  const uniqueUserAccessRequests = Array.from(
    new Set(userAccessRequests.map((a) => a.userId))
  ).map((userId) => userAccessRequests.find((a) => a.userId === userId)!);

  if (!editor) {
    return error ? <div>{toast.error(error)}</div> : null;
  }

  return (
    <div className="w-full h-full">
      <div className="w-full fixed top-0">
        <ChannelNav connectionStatus={connectionStatus} />
      </div>

      {connectionStatus === "waiting" && <WaitingPage />}

      {connectionStatus === "connected" && (
        <div className="p-4 w-full h-full mt-12 max-w-xl mx-auto">
          <EditorContent editor={editor} />
        </div>
      )}

      {uniqueUserAccessRequests.length > 0 &&
        uniqueUserAccessRequests.map((request) => (
          <ConnectAccessToast
            key={request.userId}
            userName={request.userName}
            onAccept={() => handleAcceptRequest(request.userId)}
            onReject={() =>
              setUserAccessRequests((requests) =>
                requests.filter((r) => r.userId !== request.userId)
              )
            }
          />
        ))}
    </div>
  );
};

export default Editor;
