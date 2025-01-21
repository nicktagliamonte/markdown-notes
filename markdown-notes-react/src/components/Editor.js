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
  handleCursorChange,
  cursorPosition
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
            width: "90%",
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

            if (currentPage?.tempContent !== null && currentPage?.tempContent !== undefined) {
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
          onInput={handleCursorChange} // Ensure cursor position updates on input
          onClick={handleCursorChange}
          onKeyUp={handleCursorChange}
          onKeyDown={(e) => {
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const lines = editorContent.slice(0, start).split("\n");
            const currentLineIndex = lines.length - 1;
            const currentLine = lines[currentLineIndex];
          
            const tabSpaces = "    "; // 4 spaces for a tab
            const currentLineIndentation = currentLine.match(/^ */)?.[0]?.length || 0;
            const tabDepth = Math.floor(currentLineIndentation / 4);
          
            if (e.key === "Tab") {
              e.preventDefault();
              if (e.shiftKey) {
                // Reduce indentation
                if (currentLine.startsWith(tabSpaces)) {
                  const updatedLine = currentLine.slice(4); // Remove 4 spaces
                  const updatedContent =
                    editorContent.slice(0, start - 4) +
                    updatedLine +
                    editorContent.slice(end);
                  setEditorContent(updatedContent);
                  setTempContent(updatedContent);
                  setTimeout(
                    () => e.target.setSelectionRange(start - 4, start - 4),
                    0
                  );
                }
              } else {
                // Increase indentation
                const updatedContent =
                  editorContent.slice(0, start) +
                  tabSpaces +
                  editorContent.slice(end);
                setEditorContent(updatedContent);
                setTempContent(updatedContent);
                setTimeout(() => e.target.setSelectionRange(start + 4, start + 4), 0);
              }
            } else if (e.key === "Backspace") {
              // Manual removal of spaces
              if (currentLine.startsWith("    ") && start === end && start >= 4) {
                e.preventDefault();
                const updatedLine = currentLine.slice(4); // Remove 4 spaces
                const updatedContent =
                  editorContent.slice(0, start - 4) +
                  updatedLine +
                  editorContent.slice(end);
                setEditorContent(updatedContent);
                setTempContent(updatedContent);
                setTimeout(
                  () => e.target.setSelectionRange(start - 4, start - 4),
                  0
                );
              }
            } else if (e.key === "Enter") {
              e.preventDefault();
              // Maintain indentation for the new line
              const newLineIndentation = tabSpaces.repeat(tabDepth);
              const updatedContent =
                editorContent.slice(0, start) +
                `\n${newLineIndentation}` +
                editorContent.slice(end);
              setEditorContent(updatedContent);
              setTempContent(updatedContent);
              setTimeout(
                () =>
                  e.target.setSelectionRange(
                    start + 1 + newLineIndentation.length,
                    start + 1 + newLineIndentation.length
                  ),
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