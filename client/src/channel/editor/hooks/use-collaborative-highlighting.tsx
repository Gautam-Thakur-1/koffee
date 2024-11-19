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
  const [userColors, setUserColors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!editor || !socket) return;

    // Track and emit local highlight
    const handleSelectionChange = () => {
      const { from, to } = editor.state.selection;

      // Only emit if there's an actual selection (from !== to)
      if (from !== to) {
        socket.emit("highlight-update", {
          channelId,
          highlight: {
            user: currentUser,
            from,
            to,
          },
        });
      }
    };

    // Listen for remote highlights
    const handleRemoteHighlight = (highlightData: Highlight) => {
      setUserColors((prev) => ({
        ...prev,
        [highlightData.user.name]: highlightData.user.color,
      }));

      setRemoteHighlights((prev) => {
        // Remove existing highlight for this user
        const filtered = prev.filter(
          (h) => h.user.name !== highlightData.user.name
        );

        // Add new highlight
        return [
          ...filtered,
          {
            ...highlightData,
            user: {
              ...highlightData.user,
              color: userColors[highlightData.user.name],
            },
          },
        ];
      });
    };

    // Remove highlight when user stops selecting
    const handleRemoteHighlightClear = (username: string) => {
      setRemoteHighlights((prev) => prev.filter((h) => h.user.name !== username));
    };

    // Attach event listeners
    editor.on("selectionUpdate", handleSelectionChange);
    socket.on("remote-highlight", handleRemoteHighlight);
    socket.on("clear-highlight", handleRemoteHighlightClear);

    // Cleanup
    return () => {
      editor.off("selectionUpdate", handleSelectionChange);
      socket.off("remote-highlight", handleRemoteHighlight);
      socket.off("clear-highlight", handleRemoteHighlightClear);
    };
  }, [editor, socket, channelId, currentUser]);

  // Render remote highlights
  const renderRemoteHighlights = () => {
    return remoteHighlights.map((highlight) => (
      <div
        key={`highlight-${highlight.user.name}`}
        style={{
          position: "absolute",
          backgroundColor: `${highlight.user.color}50`, // Semi-transparent
          left: `${editor?.view.coordsAtPos(highlight.from)?.left || 0}px`,
          top: `${editor?.view.coordsAtPos(highlight.from)?.top || 0}px`,
          width: `${
            (editor?.view?.coordsAtPos(highlight.to)?.right || 0) -
            (editor?.view?.coordsAtPos(highlight.from)?.left || 0)
          }px`,
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
          }}
        >
          {highlight.user.name}
        </span>
      </div>
    ));
  };

  return {
    remoteHighlights,
    renderRemoteHighlights,
  };
};
