/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Box, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close"; // Import the Close icon

const TabBar = ({ sideMenuWidth, pages }) => {
  // State to track the active tab
  const [activeTabId, setActiveTabId] = useState(null);

  // Function to handle tab click to set active tab
  const handleTabClick = (id) => {
    setActiveTabId(id);
  };

  // Function to handle closing a tab
  const handleCloseTab = (idToRemove) => {
    // Filter out the tab to remove (for now we are not actually modifying the pages prop)
    const remainingTabs = pages.filter((page) => page.id !== idToRemove);

    // Set a new active tab if the current active tab is closed
    if (idToRemove === activeTabId) {
      setActiveTabId(remainingTabs[0]?.id || null);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        position: "fixed",
        top: "20px", // Below TopMenu
        left: `${sideMenuWidth + 5}px`, // Dynamic left edge
        right: "0", // Stretches to the right edge
        backgroundColor: "background.paper",
        borderBottom: "1px solid", // Add border
        borderColor: "divider", // Dynamic color from the theme
      }}
    >
      {/* Row 1: Tabs */}
      <Box
        sx={{
          flex: "1 1 auto",
          display: "flex",
          alignItems: "center",
          overflowX: "auto", // Enables horizontal scrolling
          whiteSpace: "nowrap", // Prevents tabs from wrapping
          padding: "0 8px",
          gap: "8px",
          height: "30px",
          position: "relative",
          color: "text.primary",
          "&::-webkit-scrollbar": {
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "primary.light",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "primary.light",
          },
          marginBottom: "-8px", // Push content visually up
          paddingBottom: "8px", // Leaves space for scrollbar
        }}
      >
        {/* Dynamically render pages as tabs */}
        {pages.map((page) => (
          <Box
            key={page.id} // Use the unique id for each page
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "0px 4px",
              fontSize: 15,
              height: 20,
              backgroundColor: activeTabId === page.id ? "primary.main" : "primary.light", // Highlight active tab
              borderRadius: "4px",
              color: "primary.contrastText",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
            onClick={() => handleTabClick(page.id)} // Set active tab on click
          >
            {page.title}

            {/* Close Button (X) */}
            <IconButton
              size="small"
              sx={{
                marginLeft: "8px",
                padding: "2px",
                color: "primary.contrastText",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
              onClick={(e) => {
                e.stopPropagation(); // Prevent tab click from triggering active tab change
                handleCloseTab(page.id); // Close tab by unique id
              }}
            >
              <CloseIcon sx={{ fontSize: "16px" }} />
            </IconButton>
          </Box>
        ))}

        {/* Plus Button */}
        <IconButton
          size="small"
          sx={{
            width: "18px",
            height: "18px",
            padding: "4px",
            borderRadius: "50%",
            backgroundColor: "primary.light",
            color: "primary.contrastText",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
        >
          <AddIcon sx={{ fontSize: "16px" }} /> {/* Smaller icon size */}
        </IconButton>
      </Box>
    </Box>
  );
};

export default TabBar;
