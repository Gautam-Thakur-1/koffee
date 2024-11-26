import { useState, useEffect, useCallback } from "react";
import { Editor } from "@tiptap/react";
import { Socket } from "socket.io-client";
import { UserCursor } from "../types";
import { getRandomColor } from "../utils/colors";

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

  // Validate cursor position is within document bounds
  const getValidPosition = useCallback(
    (pos: number) => {
      if (!editor?.state?.doc) return null;
      const docSize = editor.state.doc.content.size;
      return pos < 0 || pos > docSize
        ? null
        : Math.min(Math.max(0, pos), docSize);
    },
    [editor]
  );

  // Safely get coordinates for a position
  const getCursorCoords = useCallback(
    (pos: number) => {
      try {
        const validPos = getValidPosition(pos);
        if (validPos === null) return null;
        return editor?.view.coordsAtPos(validPos);
      } catch (error) {
        console.warn("Error getting cursor coordinates:", error);
        return null;
      }
    },
    [editor, getValidPosition]
  );

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
        if (!prev[cursorData.user.id]) {
          return {
            ...prev,
            [cursorData.user.id]: cursorData.user.color || getRandomColor(),
          };
        }
        return prev;
      });

      setRemoteCursors((prev) => {
        const filtered = prev.filter((c) => c.user.id !== cursorData.user.id);
        return [
          ...filtered,
          {
            ...cursorData,
            user: {
              ...cursorData.user,
              color: userColors[cursorData.user.id] || getRandomColor(),
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

    editor.on("selectionUpdate", handleSelectionUpdate);
    socket.on("remote-cursor", handleRemoteCursorUpdate);
    socket.on("user-disconnected", handleUserDisconnect);

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
      socket.off("remote-cursor", handleRemoteCursorUpdate);
      socket.off("user-disconnected", handleUserDisconnect);
    };
  }, [editor, socket, channelId, currentUser, userColors]);

  // Calculate cursor position based on from/to
  const calculateCursorPos = useCallback(
    (cursor: { from: number; to: number }) => {
      const { from, to } = cursor;
      return from === to ? from : Math.min(from, to);
    },
    []
  );

  // Render remote cursors with safety checks
  const renderRemoteCursors = useCallback(() => {
    return remoteCursors
      .map((remoteCursor) => {
        const cursorPos = calculateCursorPos(remoteCursor.cursor);
        const coords = getCursorCoords(cursorPos);

        // Don't render if we couldn't get valid coordinates
        if (!coords) return null;

        return (
          <div
            key={remoteCursor.user.name}
            className="remote-cursor transition-all duration-200"
            style={{
              position: "absolute",
              backgroundColor: remoteCursor.user.color,
              width: "2px",
              height: "1.5em",
              left: `${coords.left}px`,
              top: `${coords.top}px`,
              pointerEvents: "none", 
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
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}
            >
              {remoteCursor.user.name}
            </span>
          </div>
        );
      })
      .filter(Boolean); // Remove null elements
  }, [remoteCursors, calculateCursorPos, getCursorCoords]);

  return {
    remoteCursors,
    renderRemoteCursors,
  };
};
