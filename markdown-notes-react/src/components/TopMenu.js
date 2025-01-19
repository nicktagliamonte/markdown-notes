import React, { useContext, useState } from "react";
import { ThemeContext } from "./ThemeContext";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

const TopMenu = ({ onOpenFind, onOpenReplace, onOpenFindInNotes, onOpenReplaceInNotes, handleSaveAs, handleSave, handleOpen, notes, setNotes }) => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const [fileMenuAnchorEl, setFileMenuAnchorEl] = useState(null);
  const [viewMenuAnchorEl, setViewMenuAnchorEl] = useState(null);

  // File Menu handlers
  const handleFileMenuOpen = (event) =>
    setFileMenuAnchorEl(event.currentTarget);
  const handleFileMenuClose = () => setFileMenuAnchorEl(null);

  const handleCreateNote = (notes) => {
    // Check if notes is defined and is an array
    const highestNoteId = notes.length > 0 ? Math.max(...notes.map((note) => note.id), 0) : 0;
  
    // Create the new note and page
    const newNote = {
      id: highestNoteId + 1, // Set to one more than the current highest note id
      title: "New Note", // Default title for the new note
      pages: [
        {
          id: 1, // Starting page ID
          title: "New Page", // Default title for the new page
          content: "", // Default empty content for the new page
          tempContent: "",
        },
      ],
    };
  
    // Return the updated notes array with the new note
    return [...notes, newNote];
  };  

  // View Menu handlers
  const handleViewMenuOpen = (event) =>
    setViewMenuAnchorEl(event.currentTarget);
  const handleViewMenuClose = () => setViewMenuAnchorEl(null);  

  return (
    <AppBar sx={{ height: 20, boxShadow: "none" }}>
      <Toolbar
        sx={{
          minHeight: 0, // Override the default min-height of the Toolbar
          height: 20, // Set a fixed height of 20px for the Toolbar
          display: "flex",
          alignItems: "center", // Center the content vertically
          padding: 0,
          // Ensure this applies for all screen sizes
          "@media (min-width: 0px)": {
            minHeight: 0,
            height: 20,
            padding: 0,
            margin: 0,
          },
          "@media (min-width: 600px)": {
            minHeight: 0,
            height: 20,
            padding: 0,
            margin: 0,
          },
          "@media (min-width: 960px)": {
            minHeight: 0,
            height: 20,
            padding: 0,
            margin: 0,
          },
          "@media (min-width: 1280px)": {
            minHeight: 0,
            height: 20,
            padding: 0,
            margin: 0,
          },
          "@media (min-width: 1920px)": {
            minHeight: 0,
            height: 20,
            padding: 0,
            margin: 0,
          },
        }}
      >
        {/* File Button and Menu */}
        <Button
          color="inherit"
          onClick={handleFileMenuOpen}
          sx={{
            "@media (min-width: 0px)": {
              padding: 0,
              margin: 0,
              minWidth: 0,
              width: 50,
            },
            "@media (min-width: 600px)": {
              padding: 0,
              margin: 0,
              minWidth: 0,
              width: 50,
            },
            "@media (min-width: 960px)": {
              padding: 0,
              margin: 0,
              minWidth: 0,
              width: 50,
            },
            "@media (min-width: 1280px)": {
              padding: 0,
              margin: 0,
              minWidth: 0,
              width: 50,
            },
            "@media (min-width: 1920px)": {
              padding: 0,
              margin: 0,
              minWidth: 0,
              width: 50,
            },
          }}
        >
          File
        </Button>
        <Menu
          anchorEl={fileMenuAnchorEl}
          open={Boolean(fileMenuAnchorEl)}
          onClose={handleFileMenuClose}
        >
          <MenuItem
            onClick={() => {
              handleOpen();
              handleFileMenuClose();
            }}
          >
            Open
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleSave();
              handleFileMenuClose();
            }}
          >
            Save
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleSaveAs();
              handleFileMenuClose();
            }}
          >
            Save As
          </MenuItem>
          <MenuItem
            onClick={() => {
              setNotes(handleCreateNote(notes));
              handleFileMenuClose();
            }}
          >
            New Note
          </MenuItem>
        </Menu>

        {/* View Button and Menu */}
        <Button
          color="inherit"
          onClick={handleViewMenuOpen}
          sx={{
            "@media (min-width: 0px)": {
              padding: 0,
              margin: 0,
              minWidth: 0,
              width: 50,
            },
            "@media (min-width: 600px)": {
              padding: 0,
              margin: 0,
              minWidth: 0,
              width: 50,
            },
            "@media (min-width: 960px)": {
              padding: 0,
              margin: 0,
              minWidth: 0,
              width: 50,
            },
            "@media (min-width: 1280px)": {
              padding: 0,
              margin: 0,
              minWidth: 0,
              width: 50,
            },
            "@media (min-width: 1920px)": {
              padding: 0,
              margin: 0,
              minWidth: 0,
              width: 50,
            },
          }}
        >
          View
        </Button>
        <Menu
          anchorEl={viewMenuAnchorEl}
          open={Boolean(viewMenuAnchorEl)}
          onClose={handleViewMenuClose}
        >
          <MenuItem onClick={handleViewMenuClose}>Toggle Line Numbers</MenuItem>
          <MenuItem
            onClick={() => {
              toggleDarkMode();
              handleViewMenuClose();
            }}
          >
            {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopMenu;
