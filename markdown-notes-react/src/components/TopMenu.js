import React, { useContext, useState } from "react";
import { ThemeContext } from "./ThemeContext";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

const TopMenu = () => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const [fileMenuAnchorEl, setFileMenuAnchorEl] = useState(null);
  const [editMenuAnchorEl, setEditMenuAnchorEl] = useState(null);
  const [viewMenuAnchorEl, setViewMenuAnchorEl] = useState(null);

  // File Menu handlers
  const handleFileMenuOpen = (event) =>
    setFileMenuAnchorEl(event.currentTarget);
  const handleFileMenuClose = () => setFileMenuAnchorEl(null);

  // Edit Menu handlers
  const handleEditMenuOpen = (event) =>
    setEditMenuAnchorEl(event.currentTarget);
  const handleEditMenuClose = () => setEditMenuAnchorEl(null);

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
            <MenuItem onClick={handleFileMenuClose}>Open</MenuItem>
            <MenuItem onClick={handleFileMenuClose}>Save</MenuItem>
            <MenuItem onClick={handleFileMenuClose}>Save As</MenuItem>
          </Menu>

          {/* Edit Button and Menu */}
          <Button
            color="inherit"
            onClick={handleEditMenuOpen}
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
            Edit
          </Button>
          <Menu
            anchorEl={editMenuAnchorEl}
            open={Boolean(editMenuAnchorEl)}
            onClose={handleEditMenuClose}
          >
            <MenuItem onClick={handleEditMenuClose}>Find</MenuItem>
            <MenuItem onClick={handleEditMenuClose}>Replace</MenuItem>
            <MenuItem onClick={handleEditMenuClose}>Find In Notes</MenuItem>
            <MenuItem onClick={handleEditMenuClose}>Replace In Notes</MenuItem>
            <MenuItem onClick={handleEditMenuClose}>Hyperlink</MenuItem>
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
            <MenuItem onClick={handleViewMenuClose}>
              Toggle Line Numbers
            </MenuItem>
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
