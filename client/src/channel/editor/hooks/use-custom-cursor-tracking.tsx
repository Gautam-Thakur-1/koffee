import { useState, useEffect, useRef } from "react";
import { Editor } from "@tiptap/react";
import { Socket } from "socket.io-client";
import { UserCursor } from "../types";
import { getRandomColor } from "../utils/colors";
import { Decoration, DecorationSet } from "prosemirror-view";


export const useCustomCursorTracking = (
  editor: Editor | null,
  socket: Socket,
  channelId: string,
  currentUser: {
    name: string;
    color: string;
  }
) => {
  const [remoteCursors, setRemoteCursors] = useState<UserCursor[]>([]);
  const [userColors, setUserColors] = useState<Record<string, string>>({});

  if (!editor) {
    return {
      remoteCursors,
      renderRemoteCursors: () => null,
    };
  }

  useEffect(() => {
    if (!editor || !socket) return;

    // Track and emit local cursor position
    const handleSelectionUpdate = () => {
      const { from, to } = editor.state.selection;
      socket.emit("cursor-update", {
        channelId,
        cursor: { from, to },
        user: currentUser,
      });
    };

    // Listen for remote cursor updates
    const handleRemoteCursorUpdate = (cursorData: UserCursor) => {
      setUserColors((prev) => {
        // Assign a color if the user doesn't already have one
        if (!prev[cursorData.user.id]) {
          return {
            ...prev,
            [cursorData.user.id]: cursorData.user.color || getRandomColor(),
          };
        }
        return prev; // Keep existing colors
      });

      setRemoteCursors((prev) => {
        const filtered = prev.filter((c) => c.user.id !== cursorData.user.id);

        return [
          ...filtered,
          {
            ...cursorData,
            user: {
              ...cursorData.user,
              color: userColors[cursorData.user.id] || getRandomColor(), // Assign consistent color
            },
          },
        ];
      });
    };

    // Listen for disconnections
    const handleUserDisconnect = (userId: string) => {
      setRemoteCursors((prev) => prev.filter((c) => c.user.id !== userId));
      setUserColors((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    };

    // Attach event listeners
    editor.on("selectionUpdate", handleSelectionUpdate);
    socket.on("remote-cursor", handleRemoteCursorUpdate);
    socket.on("user-disconnected", handleUserDisconnect);

    // Cleanup
    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
      socket.off("remote-cursor", handleRemoteCursorUpdate);
      socket.off("user-disconnected", handleUserDisconnect);
    };
  }, [editor, socket, channelId, currentUser]);

  // Render remote cursors
  const renderRemoteCursors = () => {
    return remoteCursors.map((remoteCursor) => (
      <div
        key={remoteCursor.user.name}
        className="remote-cursor"
        style={{
          position: "absolute",
          backgroundColor: remoteCursor.user.color,
          width: "2px",
          height: "1.5em",
          // Calculate position based on cursor.from
        }}
      >
        <span
          className="cursor-label"
          style={{
            position: "absolute",
            top: "-1.5em",
            backgroundColor: remoteCursor.user.color,
            color: "white",
            padding: "2px 4px",
            borderRadius: "3px",
            fontSize: "0.7em",
          }}
        >
          {remoteCursor.user.name}
        </span>
      </div>
    ));
  };

  return {
    remoteCursors,
    renderRemoteCursors,
  };
};
