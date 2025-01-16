import React from "react";
import { useTheme } from "@mui/material/styles";

const Editor = ({
  sideMenuWidth,
  tabBarHeight,
  height,
  onMouseDown,
  editorContent,
  setEditorContent,
  setUnsavedChanges,
  notes,
  setNotes,
  activeNoteId,
  activePageId,
}) => {
  const theme = useTheme();

  const setTempContent = (updatedContent) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => {
        if (note.id !== activeNoteId) return note;
        return {
          ...note,
          pages: note.pages.map((page) => {
            if (page.id !== activePageId) return page;
            return { ...page, tempContent: updatedContent };
          }),
        };
      })
    );
  };

  return (
    <div
      style={{
        position: "absolute",
        top: tabBarHeight,
        left: sideMenuWidth + 5,
        width: `calc(100% - ${sideMenuWidth + 5}px)`,
        height: height - 10,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        boxSizing: "border-box",
        overflow: "auto",
      }}
    >
      {editorContent === null || editorContent === undefined ? (
        // Static message for no active tab
        <div
          style={{
            width: "100%",
            height: "90%",
            padding: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "16px",
            fontFamily: "monospace",
            color: theme.palette.text.secondary,
          }}
        >
          Select a page from the left or open a new note to get started.
        </div>
      ) : (
        // Editable textarea for active tab
        <textarea
          value={(() => {
            const currentNote = notes.find((note) => note.id === activeNoteId);
            const currentPage = currentNote?.pages.find(
              (page) => page.id === activePageId
            );

            // Check for tempContent: if it's non-empty, use it. If not, fall back to editorContent
            if (currentPage?.tempContent !== "") {
              setEditorContent(currentPage.tempContent);
              return currentPage.tempContent; // Use tempContent if it exists and is not empty
            }

            return editorContent || currentPage?.content || ""; // Fallback to editorContent or content (if no tempContent)
          })()} // Dynamically set the content based on tempContent or fallback to editorContent
          onChange={(e) => {
            const updatedValue = e.target.value;
            setEditorContent(updatedValue); // Update editorContent with new input
            setUnsavedChanges(true); // Mark changes as unsaved

            // Update tempContent for the active page
            setTempContent(updatedValue); // Set tempContent for the current page
          }}
          onKeyDown={(e) => {
            if (e.key === "Tab") {
              e.preventDefault();
              const start = e.target.selectionStart;
              const end = e.target.selectionEnd;

              const value =
                editorContent.substring(0, start) +
                "    " +
                editorContent.substring(end);
              setEditorContent(value);
              setTempContent(value); // Sync tempContent with editorContent

              setTimeout(
                () => e.target.setSelectionRange(start + 4, start + 4),
                0
              );
            }
          }}
          style={{
            width: "100%",
            height: "90%",
            padding: "20px",
            border: "none",
            outline: "none",
            resize: "none",
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            fontSize: "16px",
            fontFamily: "monospace",
            boxSizing: "border-box",
          }}
          placeholder="Start typing your notes here..."
          disabled={editorContent === null || editorContent === undefined} // Disable editing when no active tab
        />
      )}
      {/* Resizable handle */}
      <div
        onMouseDown={onMouseDown}
        style={{
          position: "absolute",
          bottom: "0",
          left: "0",
          width: "100%",
          height: "5px",
          cursor: "ns-resize",
          backgroundColor: theme.palette.divider,
        }}
      ></div>
    </div>
  );
};

export default Editor;
