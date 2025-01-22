/* eslint-disable no-restricted-globals */
import React, { useContext, useState, useEffect, useRef } from "react";
import { ThemeContext } from "./ThemeContext";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Popper from "@mui/material/Popper";

const TopMenu = ({ handleSaveAs, handleSave, handleOpen, notes, setNotes, setFontFamily, activeNoteId, activePageId, getCursorIndex, setWordWrap }) => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);

  // State to track whether the menus are open
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
  const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
  const [isFontMenuOpen, setIsFontMenuOpen] = useState(false); // Font menu state

  // Anchors for the menus (these are used for positioning)
  const [fileMenuAnchorEl, setFileMenuAnchorEl] = useState(null);
  const [viewMenuAnchorEl, setViewMenuAnchorEl] = useState(null);
  const [editMenuAnchorEl, setEditMenuAnchorEl] = useState(null);
  const [fontMenuAnchorEl, setFontMenuAnchorEl] = useState(null); // Font menu anchor

  // Refs to detect outside clicks
  const fileMenuRef = useRef(null);
  const viewMenuRef = useRef(null);
  const editMenuRef = useRef(null);
  const fontMenuRef = useRef(null);

  // File Menu handlers
  const handleFileMenuOpen = (event) => {
    if (isFileMenuOpen) {
      setIsFileMenuOpen(false);
      setFileMenuAnchorEl(null);
    } else {
      setIsFileMenuOpen(true);
      setFileMenuAnchorEl(event.currentTarget);
    }
    // Close other menus
    handleViewMenuClose();
    handleEditMenuClose();
  };

  const handleFileMenuClose = () => {
    setIsFileMenuOpen(false);
    setFileMenuAnchorEl(null);
  };

  // Edit Menu handlers
  const handleEditMenuOpen = (event) => {
    if (isEditMenuOpen) {
      setIsEditMenuOpen(false);
      setEditMenuAnchorEl(null);
    } else {
      setIsEditMenuOpen(true);
      setEditMenuAnchorEl(event.currentTarget);
    }
    // Close other menus
    handleViewMenuClose();
    handleFileMenuClose();
  };

  const handleEditMenuClose = () => {
    setIsEditMenuOpen(false);
    setEditMenuAnchorEl(null);
    handleFontMenuClose(); // Ensure Font menu closes with Edit menu
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
    // Close other menus
    handleFileMenuClose();
    handleEditMenuClose();
  };

  const handleViewMenuClose = () => {
    setIsViewMenuOpen(false);
    setViewMenuAnchorEl(null);
  };

  // Font Menu handlers
  const handleFontMenuOpen = (event) => {
    setIsFontMenuOpen(true);
    setFontMenuAnchorEl(event.currentTarget);
  };

  const handleFontMenuClose = () => {
    setIsFontMenuOpen(false);
    setFontMenuAnchorEl(null);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Handle File menu
      if (
        fileMenuRef.current &&
        !fileMenuRef.current.contains(event.target) &&
        !fileMenuAnchorEl?.contains(event.target)
      ) {
        setIsFileMenuOpen(false);
        setFileMenuAnchorEl(null);
      }
  
      // Handle View menu
      if (
        viewMenuRef.current &&
        !viewMenuRef.current.contains(event.target) &&
        !viewMenuAnchorEl?.contains(event.target)
      ) {
        setIsViewMenuOpen(false);
        setViewMenuAnchorEl(null);
      }
  
      // Handle Edit menu, special case with Font submenu
      if (
        editMenuRef.current &&
        !editMenuRef.current.contains(event.target) && // Click is not inside Edit menu
        !editMenuAnchorEl?.contains(event.target) && // Click is not on Edit menu button
        !(fontMenuRef.current && fontMenuRef.current.contains(event.target)) // Click is not inside Font submenu
      ) {
        setIsEditMenuOpen(false);
        setEditMenuAnchorEl(null);
      }
  
      // Handle Font menu independently (only closes if click is outside both Font menu and Edit menu)
      if (
        fontMenuRef.current &&
        !fontMenuRef.current.contains(event.target) &&
        !editMenuRef.current?.contains(event.target) &&
        !fontMenuAnchorEl?.contains(event.target)
      ) {
        setIsFontMenuOpen(false);
        setFontMenuAnchorEl(null);
      }
    };  

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fileMenuAnchorEl, viewMenuAnchorEl, editMenuAnchorEl, fontMenuAnchorEl]);

  const addTimeAndDate = () => {
    const timeAndDate = new Date().toLocaleString();
  
    // Get the string index for the current cursor position
    const cursorIndex = getCursorIndex();
  
    setNotes((prevNotes) =>
      prevNotes.map((note) => {
        if (note.id !== activeNoteId) {
          return note;
        }
  
        return {
          ...note,
          pages: note.pages.map((page) => {
            if (page.id !== activePageId) {
              return page;
            }
  
            // If tempContent is not null, add time and date to it
            if (page.tempContent !== null) {
              const updatedTempContent =
                page.tempContent.slice(0, cursorIndex) +
                timeAndDate +
                page.tempContent.slice(cursorIndex);
  
              return {
                ...page,
                tempContent: updatedTempContent,
              };
            }
  
            // If tempContent is null, copy content to tempContent and add time and date
            const updatedTempContentFromContent =
              page.content.slice(0, cursorIndex) +
              timeAndDate +
              page.content.slice(cursorIndex);
  
            return {
              ...page,
              tempContent: updatedTempContentFromContent,
            };
          }),
        };
      })
    );
  };  

  const toggleWordWrap = () => {
    setWordWrap((prev) => !prev);
  };

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
            handleEditMenuClose();
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
          File
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
            handleEditMenuClose();
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
          View
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
              borderTopLeftRadius: "6px",
              borderTopRightRadius: "6px",
            }}
          >
            {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </MenuItem>
          <MenuItem
            onClick={toggleWordWrap}
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
            Toggle Word Wrap
          </MenuItem>
        </Popper>

        {/* Edit Button and Menu */}
        <Button
          color="inherit"
          onClick={(event) => {
            handleEditMenuOpen(event);
            handleFileMenuClose();
            handleViewMenuClose();
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
          Edit
        </Button>
        <Popper
          ref={editMenuRef}
          anchorEl={editMenuAnchorEl}
          open={isEditMenuOpen}
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
                offset: [30, 0],
              },
            },
          ]}
          style={{
            zIndex: 1200,
            boxShadow: "2px 8px 12px rgba(0, 0, 0, 0.3)",
            borderRadius: "8px",
            position: "absolute",
          }}
        >
          <MenuItem
            onMouseEnter={(event) => handleFontMenuOpen(event)} // Open the Font submenu on hover
            sx={{
              backgroundColor: (theme) => theme.palette.menu.default,
              "&:hover": {
                backgroundColor: (theme) => theme.palette.menu.hover,
              },
              color: (theme) => theme.palette.text.primary,
              borderTopRightRadius: "6px",
              borderTopLeftRadius: "6px",
            }}
          >
            Font <span style={{ marginLeft: '28px', fontSize: 10 }}>▶</span>
          </MenuItem>
          <MenuItem
            onClick={() => {
              addTimeAndDate();
              handleEditMenuClose();
            }}
            sx={{
              backgroundColor: (theme) => theme.palette.menu.default,
              "&:hover": {
                backgroundColor: (theme) => theme.palette.menu.hover,
              },
              color: (theme) => theme.palette.text.primary,
            }}
          >
            Time/Date 
          </MenuItem>
          <MenuItem
            onClick={() => {}}
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
            Select All 
          </MenuItem>
        </Popper>

        {/* Font Submenu */}
        <Popper
          anchorEl={fontMenuAnchorEl}
          ref={fontMenuRef}
          open={isFontMenuOpen}
          onMouseLeave={(event) => handleFontMenuClose(event)}
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
                offset: [112, -36],
              },
            },
          ]}
          style={{
            zIndex: 1200,
            boxShadow: "2px 8px 12px rgba(0, 0, 0, 0.3)",
            borderRadius: "8px",
            position: "absolute",
          }}
        >
          <MenuItem
            onClick={() => {
              setFontFamily("monospace");
              handleFontMenuClose();
              handleEditMenuClose();
            }}
            sx={{
              backgroundColor: (theme) => theme.palette.menu.default,
              "&:hover": {
                backgroundColor: (theme) => theme.palette.menu.hover,
              },
              color: (theme) => theme.palette.text.primary,
              borderTopLeftRadius: "6px",
              borderTopRightRadius: "6px"
            }}
          >
            Monospace
          </MenuItem>
          <MenuItem
            onClick={() => {
              setFontFamily("serif");
              handleFontMenuClose();
              handleEditMenuClose();}}
            sx={{
              backgroundColor: (theme) => theme.palette.menu.default,
              "&:hover": {
                backgroundColor: (theme) => theme.palette.menu.hover,
              },
              color: (theme) => theme.palette.text.primary,
            }}
          >
            Serif
          </MenuItem>
          <MenuItem
            onClick={() => {
              setFontFamily("sans-serif");
              handleFontMenuClose();
              handleEditMenuClose();}}
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
            Sans-Serif
          </MenuItem>
        </Popper>
      </Toolbar>
    </AppBar>
  );
};

export default TopMenu;
