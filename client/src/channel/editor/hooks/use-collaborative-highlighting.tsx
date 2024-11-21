import { useState, useEffect } from "react";
import { Editor } from "@tiptap/react";
import { Socket } from "socket.io-client";

export interface Highlight {
  user: {
    name: string;
    color: string;
  };
  from: number;
  to: number;
}

export const useCollaborativeHighlight = (
  editor: Editor | null,
  socket: Socket,
  channelId: string,
  currentUser: {
    name: string;
    color: string;
  }
) => {
  const [remoteHighlights, setRemoteHighlights] = useState<Highlight[]>([]);

  useEffect(() => {
    if (!editor || !socket) return;

    // Track and emit local highlight
    const handleSelectionChange = () => {
      const { from, to } = editor.state.selection;

      if (from !== to) {
        // There is a selection - emit highlight
        socket.emit("highlight-update", {
          channelId,
          highlight: {
            user: currentUser,
            from,
            to,
          },
        });
      } else {
        // No selection - clear highlight
        socket.emit("clear-highlight", {
          channelId,
          username: currentUser.name,
        });
      }
    };

    // Listen for remote highlights
    const handleRemoteHighlight = (highlightData: Highlight) => {
      setRemoteHighlights((prev) => {
        // Remove existing highlight for this user
        const filtered = prev.filter(
          (h) => h.user.name !== highlightData.user.name
        );

        // Add new highlight, preserving the original user color
        return [...filtered, highlightData];
      });
    };

    // Remove highlight when user stops selecting
    const handleRemoteHighlightClear = (username: string) => {
      setRemoteHighlights((prev) =>
        prev.filter((h) => h.user.name !== username)
      );
    };

    // Attach event listeners
    editor.on("selectionUpdate", handleSelectionChange);
    socket.on("remote-highlight", handleRemoteHighlight);
    socket.on("remote-clear-highlight", handleRemoteHighlightClear);

    // Clear all highlights when unmounting
    return () => {
      editor.off("selectionUpdate", handleSelectionChange);
      socket.off("remote-highlight", handleRemoteHighlight);
      socket.off("clear-highlight", handleRemoteHighlightClear);

      // Clear this user's highlight when unmounting
      socket.emit("clear-highlight", {
        channelId,
        username: currentUser.name,
      });
    };
  }, [editor, socket, channelId, currentUser]);

  // Render remote highlights with error handling for coordinates
  const renderRemoteHighlights = () => {
    return remoteHighlights.map((highlight) => {
      // Get coordinates safely
      const fromCoords = editor?.view.coordsAtPos(highlight.from);
      const toCoords = editor?.view.coordsAtPos(highlight.to);

      if (!fromCoords || !toCoords) return null;

      const width = toCoords.right - fromCoords.left;

      // Don't render invalid highlights
      if (width <= 0) return null;

      return (
        <div
          key={`highlight-${highlight.user.name}-${highlight.from}-${highlight.to}`}
          style={{
            position: "absolute",
            backgroundColor: `${highlight.user.color}50`,
            left: `${fromCoords.left}px`,
            top: `${fromCoords.top}px`,
            width: `${width}px`,
            height: "1.5em",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <span
            style={{
              position: "absolute",
              top: "-1.5em",
              backgroundColor: highlight.user.color,
              color: "white",
              padding: "2px 4px",
              borderRadius: "3px",
              fontSize: "0.7em",
              whiteSpace: "nowrap",
            }}
          >
            {highlight.user.name}
          </span>
        </div>
      );
    });
  };

  return {
    remoteHighlights,
    renderRemoteHighlights,
  };
};
