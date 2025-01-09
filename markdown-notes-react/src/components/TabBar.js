/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import { Box, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close"; // Import the Close icon

const TabBar = ({ sideMenuWidth }) => {
  // State for tabs
  const [tabs, setTabs] = useState([
    { id: 1, name: "Tab 1" },
    { id: 2, name: "Tab 2" },
  ]);
  
  // State to track nextTabNumber, starting at 3
  const [nextTabNumber, setNextTabNumber] = useState(3);

  const activeNoteRef = useRef(null);

  // Function to handle adding a new tab
  const handleAddTab = () => {
    const newTab = { id: nextTabNumber, name: `Tab ${nextTabNumber}` };
    setTabs((prevTabs) => [...prevTabs, newTab]);
    setNextTabNumber((prevNumber) => prevNumber + 1); // Increment nextTabNumber
  };

  // Function to handle closing a tab
  const handleCloseTab = (idToRemove) => {
    setTabs((prevTabs) => {
      // Remove the tab with the specified id
      return prevTabs.filter((tab) => tab.id !== idToRemove);
    });
  };  

  // Calculate the minimum width dynamically
  const minWidth = activeNoteRef.current
    ? activeNoteRef.current.offsetWidth + 18 + 16 // Text width + button width + padding
    : 0;

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
        ref={activeNoteRef}
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
              backgroundColor: "primary.light",
              borderRadius: "4px",
              color: "primary.contrastText",
              cursor: "pointer",
            }}
          >
            {tab.name}

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
              onClick={() => handleCloseTab(tab.id)} // Close tab by unique id
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