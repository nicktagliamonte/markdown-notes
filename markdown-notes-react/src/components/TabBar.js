/* eslint-disable no-unused-vars */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Box, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close"; // Import the Close icon

const TabBar = forwardRef(
  (
    {
      sideMenuWidth,
      pages,
      setEditorContent,
      activeTabId,
      setActiveTabId,
      activeNoteId,
      notes,
      setNotes,
      setActivePageId,
      setActiveNoteId
    },
    ref
  ) => {
    const [tabs, setTabs] = useState([]);

    // State to track the next tab number (for add functionality)
    const [nextTabNumber, setNextTabNumber] = useState(0);
    const [nextTabId, setNextTabId] = useState(1);
    useEffect(() => {
      if (!activeNoteId || !notes) return;

      const activeNote = notes.find((note) => note.id === activeNoteId);

      if (activeNote && activeNote.pages.length > 0) {
        const maxId = Math.max(...activeNote.pages.map((page) => page.id));
        setNextTabId(maxId + 1);
      }
    }, [activeNoteId, notes]);

    // Function to handle tab click to set active tab
    const handleTabClick = (id) => {
      setActiveTabId(id);
      setActivePageId(id);
      if (pages && Array.isArray(pages)) {
        setEditorContent(
          pages.find((page) => page.id === id)?.content || ""
        );
      } else {
        setEditorContent(""); // Default to empty string if pages are invalid
      }
    };

    const handleCloseTab = (idToRemove) => {
      const remainingTabs = tabs.filter((tab) => tab.id !== idToRemove);
    
      // If the closed tab is the active tab, reset the active tab
      if (idToRemove === activeTabId) {
        // Set new active tab if one exists, otherwise set null
        const newActiveTabId = remainingTabs[0]?.id || null;
        setActiveTabId(newActiveTabId);
    
        // Check if pages exist before accessing them
        if (pages && Array.isArray(pages)) {
          setEditorContent(
            pages.find((page) => page.id === newActiveTabId)?.content || ""
          );
        } else {
          setEditorContent(""); // Default to empty string if pages are invalid
        }
      }
    
      // Set editorContent to null if no tabs remain
      if (remainingTabs.length === 0) {
        setEditorContent(null);
      }
    
      // Update the tabs state with remaining tabs
      setTabs(remainingTabs);
    };    

    // Function to handle adding a new tab
    const handleAddTab = () => {
      const newTab = {
        id: nextTabId,
        title: `Tab ${nextTabNumber}`,
        content: "",
        tempContent: "", // Ensure new page has a tempContent field
      };

      // Update tabs state
      setTabs((prevTabs) => [...prevTabs, newTab]); // Add new tab to the list
      setNextTabNumber((prevNumber) => prevNumber + 1); // Increment nextTabNumber
      setNextTabId((prevNumber) => prevNumber + 1); // Increment nextTabId

      // Set new tab as active
      setActiveTabId(newTab.id);
      setActivePageId(newTab.id);

      // Set editor content for the new active tab
      setEditorContent(newTab.content || ""); // Use the content field from the newTab

      // Add a new page to the pages array of the currently active note
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === activeNoteId
            ? {
                ...note,
                pages: [
                  ...note.pages,
                  {
                    id: nextTabId,
                    title: `Tab ${nextTabNumber}`,
                    content: "",
                    tempContent: "",
                  },
                ],
              }
            : note
        )
      );
    };

    const handleAddNote = () => {
      const highestNoteId = 
        notes.length > 0 ? Math.max(...notes.map((note) => note.id), 0) : 0;
    
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
    
      // Add the new note to notes and update the active state
      setNotes((prevNotes) => {
        const updatedNotes = [...prevNotes, newNote];
        
        // Set the editor content after notes have been updated
        setEditorContent(newNote.pages[0].content || ""); // Use the content of the first page in the new note
        setActiveNoteId(newNote.id); // Set the newly added note as active
        setActivePageId(newNote.pages[0].id); // Set the first page as active
        return updatedNotes;
      });
    
      // Add the first page of the new note as a tab
      const newTab = {
        id: 1, // Matches the page ID
        title: "New Page", // Matches the page title
        content: "", // Matches the page content
        tempContent: "", // Matches the page tempContent
      };
    
      setTabs((prevTabs) => [...prevTabs, newTab]); // Add new tab to the list
      setNextTabNumber((prevNumber) => prevNumber + 1); // Increment nextTabNumber
      setNextTabId((prevNumber) => prevNumber + 1); // Increment nextTabId
      setActiveTabId(newTab.id); // Set the newly added tab as active
    };    

    const handleAddTabFromPage = (page) => {
      // Check if the tab with the same id is already open
      const existingTab = tabs.find((tab) => tab.id === page.id);

      if (existingTab) {
        // If the tab exists, set it as active
        setActiveTabId(existingTab.id);
        setEditorContent(existingTab.content || "");
      } else {
        // If the tab doesn't exist, add it as a new tab
        const newTab = {
          id: page.id,
          title: page.title,
          content: page.content, // Use the page content
        };

        setTabs((prevTabs) => [...prevTabs, newTab]);
        setNextTabNumber((prevNumber) => prevNumber + 1);
        setNextTabId((prevNumber) => prevNumber + 1);

        // Set new tab as active
        setActiveTabId(newTab.id);

        // Set editor content for the new active tab
        setEditorContent(newTab.content || "");
      }
    };

    const closeAllTabs = () => {
      setTabs([]);
      setActiveTabId(null);
      setActivePageId(null);
    };

    useImperativeHandle(ref, () => ({
      handleAddTabFromPage,
      closeAllTabs,
      getTabs: () => tabs,
      updateTab: (tabId, newTitle) => {
        setTabs((prevTabs) =>
          prevTabs.map((tab) =>
            tab.id === tabId ? { ...tab, title: newTitle } : tab
          )
        );
      },
    }));    

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
          {activeNoteId
            ? notes.find((note) => note.id === activeNoteId)?.title
            : ""}
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
            onClick={() => {
              if (activeNoteId !== null) {
                handleAddTab(); // Call handleAddTab if activeNoteId is not null
              } else {
                handleAddNote(); // Call handleAddNote if activeNoteId is null
              }
            }}
          >
            <AddIcon sx={{ fontSize: "16px" }} /> {/* Smaller icon size */}
          </IconButton>
        </Box>
      </Box>
    );
  }
);

export default TabBar;
