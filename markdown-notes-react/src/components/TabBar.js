/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Box, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close"; // Import the Close icon

const TabBar = ({ sideMenuWidth, pages, editorContent, setEditorContent }) => {
  // State to track tabs and active tab
  const [tabs, setTabs] = useState(pages || []);
  const [activeTabId, setActiveTabId] = useState(null);

  // State to track the next tab number (for add functionality)
  const [nextTabNumber, setNextTabNumber] = useState(pages.length + 1);

  // Function to handle tab click to set active tab
  const handleTabClick = (id) => {
    setActiveTabId(id);
    setEditorContent(pages.find((page) => page.id === id)?.content || "");
  };

  const handleCloseTab = (idToRemove) => {
    const remainingTabs = tabs.filter((tab) => tab.id !== idToRemove);

    // If the closed tab is the active tab, reset the active tab
    if (idToRemove === activeTabId) {
      // Set new active tab if one exists, otherwise set null
      const newActiveTabId = remainingTabs[0]?.id || null;
      setActiveTabId(newActiveTabId);

      // Set editor content to the content of the new active tab
      setEditorContent(
        pages.find((page) => page.id === newActiveTabId)?.content || ""
      );
    }

    // Update the tabs state with remaining tabs
    setTabs(remainingTabs);
  };

  // Function to handle adding a new tab
  const handleAddTab = () => {
    const newTab = {
      id: nextTabNumber,
      title: `Tab ${nextTabNumber}`,
      content: "",
    };
    setTabs((prevTabs) => [...prevTabs, newTab]); // Add new tab to the list
    setNextTabNumber((prevNumber) => prevNumber + 1); // Increment nextTabNumber

    // Set new tab as active
    setActiveTabId(newTab.id);

    // Set editor content for the new active tab
    setEditorContent(newTab.content || ""); // Use the content field from the newTab
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
      {/* Row 0: Active Note Name */}
      <Box
        sx={{
          flex: "1 1 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "left",
          padding: "0 8px",
          fontWeight: "bold",
          height: "20px",
          color: "text.primary",
          whiteSpace: "nowrap", // Prevents tabs from wrapping
        }}
      >
        Active Note Name
      </Box>

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
        {/* Dynamically render tabs */}
        {tabs.map((tab) => (
          <Box
            key={tab.id} // Use the unique id for each tab
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "0px 4px",
              fontSize: 15,
              height: 20,
              backgroundColor:
                activeTabId === tab.id ? "primary.dark" : "primary.paper", // Highlight active tab
              borderRadius: "4px",
              color: "primary.contrastText",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
            onClick={() => handleTabClick(tab.id)} // Set active tab on click
          >
            {tab.title}

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
                handleCloseTab(tab.id); // Close tab by unique id
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
          onClick={handleAddTab} // Add new tab when clicked
        >
          <AddIcon sx={{ fontSize: "16px" }} /> {/* Smaller icon size */}
        </IconButton>
      </Box>
    </Box>
  );
};

export default TabBar;
