/* eslint-disable no-restricted-globals */
import React, { useContext, useState, useEffect, useRef } from "react";
import { ThemeContext } from "./ThemeContext";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Popper from "@mui/material/Popper";

const TopMenu = ({ handleSaveAs, handleSave, handleOpen, notes, setNotes }) => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);

  // State to track whether the menus are open
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);

  // Anchors for the menus (these are used for positioning)
  const [fileMenuAnchorEl, setFileMenuAnchorEl] = useState(null);
  const [viewMenuAnchorEl, setViewMenuAnchorEl] = useState(null);

  // Refs to detect outside clicks
  const fileMenuRef = useRef(null);
  const viewMenuRef = useRef(null);

  // File Menu handlers
  const handleFileMenuOpen = (event) => {
    if (isFileMenuOpen) {
      setIsFileMenuOpen(false);
      setFileMenuAnchorEl(null);
    } else {
      setIsFileMenuOpen(true);
      setFileMenuAnchorEl(event.currentTarget);
    }
    // Ensure that view menu is closed when opening file menu
    if (isViewMenuOpen) {
      setIsViewMenuOpen(false);
      setViewMenuAnchorEl(null);
    }
  };

  const handleFileMenuClose = () => {
    setIsFileMenuOpen(false);
    setFileMenuAnchorEl(null);
  };

  const handleCreateNote = (notes) => {
    const highestNoteId =
      notes.length > 0 ? Math.max(...notes.map((note) => note.id), 0) : 0;
    const newNote = {
      id: highestNoteId + 1,
      title: "New Note",
      pages: [
        {
          id: 1,
          title: "New Page",
          content: "",
          tempContent: "",
        },
      ],
    };
    return [...notes, newNote];
  };

  // View Menu handlers
  const handleViewMenuOpen = (event) => {
    if (isViewMenuOpen) {
      setIsViewMenuOpen(false);
      setViewMenuAnchorEl(null);
    } else {
      setIsViewMenuOpen(true);
      setViewMenuAnchorEl(event.currentTarget);
    }
    // Ensure that file menu is closed when opening view menu
    if (isFileMenuOpen) {
      setIsFileMenuOpen(false);
      setFileMenuAnchorEl(null);
    }
  };

  const handleViewMenuClose = () => {
    setIsViewMenuOpen(false);
    setViewMenuAnchorEl(null);
  };

  // Handle clicks outside of the menus to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        fileMenuRef.current &&
        !fileMenuRef.current.contains(event.target) &&
        !fileMenuAnchorEl?.contains(event.target)
      ) {
        setIsFileMenuOpen(false);
        setFileMenuAnchorEl(null);
      }
      if (
        viewMenuRef.current &&
        !viewMenuRef.current.contains(event.target) &&
        !viewMenuAnchorEl?.contains(event.target)
      ) {
        setIsViewMenuOpen(false);
        setViewMenuAnchorEl(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fileMenuAnchorEl, viewMenuAnchorEl]);

  return (
    <AppBar sx={{ height: 20, boxShadow: "none" }}>
      <Toolbar
        sx={{
          minHeight: 0,
          height: 20,
          display: "flex",
          alignItems: "center",
          padding: 0,
          "@media (min-width: 0px)": {
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
          onClick={(event) => {
            handleFileMenuOpen(event);
            handleViewMenuClose(); // Close view menu when file menu opens
          }}
          sx={{
            "@media (min-width: 0px)": {
              padding: 0,
              margin: 0,
              minWidth: 0,
              width: 50,
            },
          }}
        >
          F
        </Button>
        <Popper
          ref={fileMenuRef}
          anchorEl={fileMenuAnchorEl}
          open={isFileMenuOpen}
          modifiers={[
            {
              name: "preventOverflow",
              options: {
                altBoundary: true,
                tether: false,
              },
            },
          ]}
          style={{
            zIndex: 1200,
            boxShadow: "2px 8px 12px rgba(0, 0, 0, 0.3)",
            borderRadius: "8px",
          }}
        >
          <MenuItem
            onClick={() => {
              handleOpen();
              handleFileMenuClose();
            }}
            sx={{
              backgroundColor: (theme) => theme.palette.menu.default,
              "&:hover": {
                backgroundColor: (theme) => theme.palette.menu.hover,
              },
              color: (theme) => theme.palette.text.primary,
              borderTopLeftRadius: "6px",
              borderTopRightRadius: "6px",
            }}
          >
            Open
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleSave();
              handleFileMenuClose();
            }}
            sx={{
              backgroundColor: (theme) => theme.palette.menu.default,
              "&:hover": {
                backgroundColor: (theme) => theme.palette.menu.hover,
              },
              color: (theme) => theme.palette.text.primary,
            }}
          >
            Save
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleSaveAs();
              handleFileMenuClose();
            }}
            sx={{
              backgroundColor: (theme) => theme.palette.menu.default,
              "&:hover": {
                backgroundColor: (theme) => theme.palette.menu.hover,
              },
              color: (theme) => theme.palette.text.primary,
            }}
          >
            Save As
          </MenuItem>
          <MenuItem
            onClick={() => {
              setNotes(handleCreateNote(notes));
              handleFileMenuClose();
            }}
            sx={{
              backgroundColor: (theme) => theme.palette.menu.default,
              "&:hover": {
                backgroundColor: (theme) => theme.palette.menu.hover,
              },
              color: (theme) => theme.palette.text.primary,
              borderBottomLeftRadius: "6px",
              borderBottomRightRadius: "6px",
            }}
          >
            New Note
          </MenuItem>
        </Popper>

        {/* View Button and Menu */}
        <Button
          color="inherit"
          onClick={(event) => {
            handleViewMenuOpen(event);
            handleFileMenuClose(); // Close file menu when view menu opens
          }}
          sx={{
            "@media (min-width: 0px)": {
              padding: 0,
              margin: 0,
              minWidth: 0,
              width: 50,
            },
          }}
        >
          V
        </Button>
        <Popper
          ref={viewMenuRef}
          anchorEl={viewMenuAnchorEl}
          open={isViewMenuOpen}
          modifiers={[
            {
              name: "preventOverflow",
              options: {
                altBoundary: true,
                tether: false,
              },
            },
            {
              name: "offset",
              options: {
                offset: [65, 0], // 50px shift to the right
              },
            },
          ]}
          style={{
            zIndex: 1200,
            boxShadow: "2px 8px 12px rgba(0, 0, 0, 0.3)",
            borderRadius: "8px",
            position: "absolute", // Ensure it's positioned within the container
          }}
        >
          <MenuItem
            onClick={() => {
              toggleDarkMode();
              handleViewMenuClose();
            }}
            sx={{
              backgroundColor: (theme) => theme.palette.menu.default,
              "&:hover": {
                backgroundColor: (theme) => theme.palette.menu.hover,
              },
              color: (theme) => theme.palette.text.primary,
              borderRadius: "6px",
            }}
          >
            {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </MenuItem>
        </Popper>
      </Toolbar>
    </AppBar>
  );
};

export default TopMenu;
