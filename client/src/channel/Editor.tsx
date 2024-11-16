import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

import * as Y from "yjs";

import { EditorContent, useEditor } from "@tiptap/react";
import Collaboration from "@tiptap/extension-collaboration";
import StarterKit from "@tiptap/starter-kit";

import { decodeUpdate, encodeUpdate } from "../lib/editor-helper";

const Editor = ({ channelId }: { channelId: string }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [ydoc] = useState(() => new Y.Doc());

  // Initialize socket connection
  useEffect(() => {
    const s = io(`${import.meta.env.VITE_SERVER_URL}`, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    s.on("connect", () => {
      console.log("Connected to Channel", channelId);
      s.emit("join-channel", channelId);
    });

    s.on("connect_error", (error) => {
      console.log("Connection error:", error);
    });

    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, [channelId, ydoc]);


  // Initializing Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Collaboration.configure({
        document: ydoc,
        field: "content",
      }),
    ],
    onCreate: ({ editor }) => {
      editor.commands.setContent("");
    },
    onUpdate: () => {
      const update = Y.encodeStateAsUpdate(ydoc);
      const encodedUpdate = encodeUpdate(update); // Encode to base64
      socket?.emit("update-canvas", encodedUpdate); // Send encoded update
    },
    editorProps: {
      attributes: {
        class:
          "h-full mx-auto focus:outline-none prose prose-sm sm:prose lg:prose-lg",
      },
    },
  });

  useEffect(() => {
    if (!socket || !editor) return;

    const handleUpdate = (update: string) => {
      try {
        const updateArray = decodeUpdate(update); // Decode base64 to Uint8Array
        Y.applyUpdate(ydoc, updateArray);
      } catch (error) {
        console.error("Error applying update:", error);
      }
    };

    const handleInitialState = (initialState: string) => {
      try {
        const stateArray = decodeUpdate(initialState);
        Y.applyUpdate(ydoc, stateArray);
      } catch (error) {
        console.error("Error applying initial state:", error);
      }
    };

    socket.on("channel-members", (members) => {
      console.log("Channel members:", members);
    });

    socket.on("sync-canvas", handleInitialState);

    socket.on("update-canvas", handleUpdate);

    const updateHandler = (update: Uint8Array) => {
      if (update.byteLength > 0) {
        const encodedUpdate = encodeUpdate(update); // Encode update to base64
        socket.emit("update-canvas", encodedUpdate); // Send encoded update
      }
    };

    ydoc.on("update", updateHandler);

    return () => {
      // Cleanup all socket listeners
      socket.off("channel-members");
      socket.off("sync-canvas");
      socket.off("update-canvas");
    };
  }, [channelId, socket, editor, ydoc]);

  if (!editor) {
    return null;
  }

  return <EditorContent editor={editor} />;
};

export default Editor;
