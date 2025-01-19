import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Button, TextField, Typography } from "@mui/material";

const FindModal = ({ isOpen, onClose, notes, activePageId, activeNoteId }) => {
  const theme = useTheme();
  const [isActive, setIsActive] = useState(true);
  const [position, setPosition] = useState({ top: 100, left: 100 }); // Initial modal position
  const [dragging, setDragging] = useState(false); // Track if dragging is happening
  const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 }); // Mouse start position
  const [searchTerm, setSearchTerm] = useState("");
  const [occurrences, setOccurrences] = useState([]);

  const handleFocusInsideModal = (e) => {
    e.stopPropagation(); // Prevent bubbling to the overlay
    setIsActive(true); // Regain active state when interacting with modal
  };

  // Handle mouse down event on the modal's header
  const handleMouseDown = (e) => {
    setDragging(true);
    setStartDragPos({
      x: e.clientX - position.left,
      y: e.clientY - position.top,
    });
  };

  // Handle mouse move event during dragging
  const handleMouseMove = (e) => {
    if (!dragging) return;
    const newLeft = e.clientX - startDragPos.x;
    const newTop = e.clientY - startDragPos.y;

    setPosition({
      left: newLeft,
      top: newTop,
    });
  };

  // Handle mouse up event to stop dragging
  const handleMouseUp = () => {
    setDragging(false);
  };

  // Get content for every page in every note
  const getAllPageContents = useCallback(() => {
    const allPages = [];
    notes.forEach((note) => {
      note.pages.forEach((page) => {
        allPages.push({
          noteId: note.id,
          pageId: page.id,
          content: page.content,
          tempContent: page.tempContent,
        });
      });
    });
    return allPages;
  }, [notes]);

  // Find all occurrences of the search term across multiple pages
  const findOccurrencesAcrossPages = useCallback((term, allPages) => {
    if (!term) return [];

    const results = [];
    allPages.forEach(({ noteId, pageId, content, tempContent }) => {
      const searchIn = tempContent !== "" ? tempContent : content;
      if (!searchIn) return;

      let index = searchIn.indexOf(term);
      while (index !== -1) {
        results.push({ noteId, pageId, index }); // Include note and page context
        index = searchIn.indexOf(term, index + term.length);
      }
    });

    return results;
  }, []);

  // Update occurrences when dependencies change
  useEffect(() => {
    const allPages = getAllPageContents();
    const matches = findOccurrencesAcrossPages(searchTerm, allPages);
    setOccurrences(matches);
  }, [searchTerm, getAllPageContents, findOccurrencesAcrossPages]);

  if (!isOpen) return null;

  return (
    <div
      onClick={() => setIsActive(false)} // Click outside the modal dims it
      onMouseMove={handleMouseMove} // Track movement while dragging
      onMouseUp={handleMouseUp} // Stop dragging
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: theme.palette.zIndex.modal + 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: isActive
          ? "rgba(0, 0, 0, 0.5)" // Active state overlay
          : "rgba(0, 0, 0, 0.2)", // Inactive state overlay
      }}
    >
      <Box
        onClick={handleFocusInsideModal} // Prevent bubbling to the overlay
        onMouseDown={handleMouseDown} // Start dragging
        onFocus={handleFocusInsideModal}
        sx={{
          position: "absolute", // Allow dynamic positioning
          top: position.top,
          left: position.left,
          pointerEvents: "auto",
          backgroundColor: isActive
            ? theme.palette.background.paper
            : theme.palette.action.disabledBackground,
          color: isActive
            ? theme.palette.text.primary
            : theme.palette.text.disabled,
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[5],
          padding: theme.spacing(3),
          width: "300px",
          border: isActive
            ? `2px solid ${theme.palette.primary.main}`
            : `2px solid ${theme.palette.divider}`,
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            userSelect: "none", // Prevent text selection during drag
          }}
        >
          Find in Notes
        </Typography>
        <TextField
          placeholder="Enter search term..."
          fullWidth
          size="small"
          disabled={!isActive}
          onFocus={() => setIsActive(true)} // Regain active state when focusing the input
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: theme.spacing(2),
          }}
        >
          <Button
            variant="contained"
            sx={{ width: "30%" }}
            disabled={!isActive}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            sx={{ width: "30%" }}
            disabled={!isActive}
          >
            Next
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={onClose}
            sx={{ width: "30%" }}
          >
            Exit
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default FindModal;
