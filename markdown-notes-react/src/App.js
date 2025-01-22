import React, { useState, useEffect, useRef } from "react";
import TopMenu from "./components/TopMenu";
import SideMenu from "./components/SideMenu";
import TabBar from "./components/TabBar";
import Editor from "./components/Editor";
import Preview from "./components/Preview";
import BottomBar from "./components/BottomBar";
import ConfirmationModal from "./components/ConfirmationModal";

function App() {
  // Notes
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "Note 1",
      pages: [
        { id: 1, title: "Page 1", content: "test", tempContent: null },
        {
          id: 2,
          title: "Page 2",
          content: "# test content for page two, distinct from page one",
          tempContent: null,
        },
      ],
    },
    {
      id: 2,
      title: "Note 2",
      pages: [
        { id: 3, title: "Page 1", content: "", tempContent: null },
        { id: 4, title: "Page 2", content: "", tempContent: null },
        { id: 5, title: "Page 3", content: "", tempContent: null },
      ],
    },
    {
      id: 3,
      title: "Note 3",
      pages: [{ id: 6, title: "Page 1", content: "", tempContent: null }],
    },
  ]);

  // Editor Resizing State
  const [isResizing, setIsResizing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const [height, setHeight] = useState(window.innerHeight / 2); // Initial editor height

  // SideMenu Resizing State
  const [isResizingMenu, setIsResizingMenu] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(240); // Initial SideMenu width
  const [sideMenuWidth, setSideMenuWidth] = useState(240);

  // TabBar Height
  const [tabBarHeight] = useState(70); // Fixed TabBar height

  // Active Tab
  const [activeTabId, setActiveTabId] = useState(null);

  // Editor Content
  const [editorContent, setEditorContent] = useState(null); // Shared state for content

  // FilePath and Save Handlers
  const [currentFilePath, setCurrentFilePath] = useState(null);

  const saveFile = async (fileHandle, content) => {
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
  };

  // Updates the active note by applying tempContent to content
  const saveActiveNote = () => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => {
        if (note.id !== activeNoteId) return note; // Skip non-active notes
        return {
          ...note,
          pages: note.pages.map((page) => {
            if (page.tempContent === null) return page; // Skip pages with no tempContent
            return {
              ...page,
              content: page.tempContent, // Update content with tempContent
              tempContent: null, // Reset tempContent
            };
          }),
        };
      })
    );
  };

  const handleSaveAs = async () => {
    try {
      const options = {
        suggestedName: "notes.json",
        types: [
          {
            description: "JSON Files",
            accept: { "application/json": [".json"] },
          },
        ],
      };
      const fileHandle = await window.showSaveFilePicker(options);

      saveActiveNote(); // Apply changes before saving
      await saveFile(fileHandle, JSON.stringify(notes, null, 2));
      setCurrentFilePath(fileHandle);
      setUnsavedChanges(false);
      alert("File saved successfully!");
    } catch (error) {
      console.error("Error saving file:", error);
      alert("Failed to save file.");
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSave = async () => {
    if (!currentFilePath) return handleSaveAs();
    try {
      saveActiveNote(); // Apply changes before saving
      await saveFile(currentFilePath, JSON.stringify(notes, null, 2));
      setUnsavedChanges(false);
      alert("File saved successfully!");
    } catch (error) {
      console.error("Error saving file:", error);
      alert("Failed to save file.");
    }
  };

  useEffect(() => {
    if (!currentFilePath) return;

    const autosaveInterval = setInterval(() => {
      handleSave();
    }, 5 * 60 * 1000); // Save every 5 minutes

    return () => clearInterval(autosaveInterval); // Cleanup on component unmount
  }, [currentFilePath, handleSave, notes]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        handleSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSave]);

  // Load file picker
  const handleOpen = async () => {
    try {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: "JSON Files",
            accept: { "application/json": [".json"] },
          },
        ],
      });
      const file = await fileHandle.getFile();
      const text = await file.text();
      const data = JSON.parse(text);

      // Validate the data structure
      if (!Array.isArray(data) || !data.every(validateNote)) {
        throw new Error("Invalid file format");
      }

      setNotes(data); // Replace notes with the loaded data
      setCurrentFilePath(fileHandle); // Track the file handle for future saves
      alert("File loaded successfully!");
    } catch (error) {
      console.error("Error opening file:", error);
      alert("Failed to open file. Ensure it is a valid JSON file.");
    }
  };

  const validateNote = (note) =>
    note.id &&
    typeof note.title === "string" &&
    Array.isArray(note.pages) &&
    note.pages.every(
      (page) =>
        page.id &&
        typeof page.title === "string" &&
        typeof page.content === "string"
    );

  const [fontFamily, setFontFamily] = useState("sans-serif");

  // Editor Height Resizing Logic
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing) {
        const deltaY = e.clientY - startY;
        setHeight(Math.max(100, startHeight + deltaY)); // Enforce minimum editor height
      }

      if (isResizingMenu) {
        const deltaX = e.clientX - startX;
        setSideMenuWidth(Math.max(150, startWidth + deltaX)); // Enforce minimum SideMenu width
      }
    };

    const handleMouseUp = () => {
      if (isResizing) setIsResizing(false);
      if (isResizingMenu) setIsResizingMenu(false);
      document.body.style.userSelect = "auto";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    if (isResizing || isResizingMenu) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "none"; // Prevent text selection
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, startY, startHeight, isResizingMenu, startX, startWidth]);

  const handleMouseDownEditor = (e) => {
    setIsResizing(true);
    setStartY(e.clientY);
    setStartHeight(height);
  };

  const handleMouseDownMenu = (e) => {
    setIsResizingMenu(true);
    setStartX(e.clientX);
    setStartWidth(sideMenuWidth);
  };

  const tabBarRef = useRef(null);

  const handleAddTabFromPage = (page) => {
    // Call the function defined in TabBar.js to add a new tab
    tabBarRef.current.handleAddTabFromPage(page);
  };

  const closeAllTabs = () => {
    tabBarRef.current.closeAllTabs();
  };

  const [activeNoteId, setActiveNoteId] = useState(null);
  const [activePageId, setActivePageId] = useState(null);

  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [nextPage, setNextPage] = useState(null);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const parentNote =
    nextPage === null
      ? ""
      : notes.find((note) => note.pages.some((p) => p.id === nextPage.id));

  const revertContent = () => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => {
        if (note.id === activeNoteId) {
          return {
            ...note,
            pages: note.pages.map((page) => ({
              ...page,
              tempContent: null, // Reset tempContent
            })),
          };
        }
        return note; // Return note unchanged if not active
      })
    );
  };

  const handleModalConfirm = () => {
    closeAllTabs();
    setActiveNoteId(parentNote.id);
    handleAddTabFromPage(nextPage);
    setActivePageId(nextPage.id);
    setUnsavedChanges(false);
    revertContent();
    setModalOpen(false);
  };

  // Bottom Bar Handlers
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });

  const handleCursorChange = (e) => {
    const textarea = e.target;
    const cursorPos = textarea.selectionStart;

    const lines = textarea.value.slice(0, cursorPos).split("\n");
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;

    setCursorPosition({ line, column });
  };

  const getCursorIndex = () => {
    // Find the active note based on activeNoteId
    const activeNote = notes.find((note) => note.id === activeNoteId);
  
    // If the active note is not found, return 0 (or handle as needed)
    if (!activeNote) return 0;
  
    // Find the active page based on activePageId within the active note
    const activePage = activeNote.pages.find((page) => page.id === activePageId);
  
    // If the active page is not found, return 0 (or handle as needed)
    if (!activePage) return 0;
  
    // Get the current content from either tempContent or content
    const content = activePage.tempContent !== null ? activePage.tempContent : activePage.content;
  
    // Split content into lines
    const lines = content.split("\n");
  
    // Sum the lengths of lines up to the current line
    let index = 0;
    for (let i = 0; i < cursorPosition.line - 1; i++) {
      index += lines[i].length + 1; // Add length of line and the newline character
    }
  
    // Add the column position in the current line
    index += cursorPosition.column - 1;
  
    return index;
  };  

  const [wordWrap, setWordWrap] = useState(true);

  return (
    <div>
      <TopMenu
        handleSaveAs={handleSaveAs}
        handleSave={handleSave}
        handleOpen={handleOpen}
        notes={notes}
        setNotes={setNotes}
        setFontFamily={setFontFamily}
        cursorPosition={cursorPosition}
        activeNoteId={activeNoteId}
        activePageId={activePageId}
        getCursorIndex={getCursorIndex}
        setWordWrap={setWordWrap}
      />
      <SideMenu
        notes={notes}
        width={sideMenuWidth}
        onMouseDown={handleMouseDownMenu}
        handleAddTabFromPage={handleAddTabFromPage}
        activeNoteId={activeNoteId}
        setActiveNoteId={setActiveNoteId}
        setActivePageId={setActivePageId}
        closeAllTabs={closeAllTabs}
        unsavedChanges={unsavedChanges}
        setNextPage={setNextPage}
        setModalOpen={setModalOpen}
        setNotes={setNotes}
        tabBarRef={tabBarRef}
      />
      <TabBar
        sideMenuWidth={sideMenuWidth}
        notes={notes}
        setNotes={setNotes}
        activeTabId={activeTabId}
        setActiveTabId={setActiveTabId}
        editorContent={editorContent}
        setEditorContent={setEditorContent}
        ref={tabBarRef}
        activeNoteId={activeNoteId}
        setActiveNoteId={setActiveNoteId}
        setActivePageId={setActivePageId}
      />
      <ConfirmationModal
        open={modalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
      />
      <Editor
        sideMenuWidth={sideMenuWidth}
        tabBarHeight={tabBarHeight}
        height={height}
        onMouseDown={handleMouseDownEditor}
        editorContent={editorContent}
        setEditorContent={setEditorContent}
        setUnsavedChanges={setUnsavedChanges}
        notes={notes}
        setNotes={setNotes}
        activeNoteId={activeNoteId}
        activePageId={activePageId}
        handleCursorChange={handleCursorChange}
        wordWrap={wordWrap}
      />
      <Preview
        editorHeight={height}
        sideMenuWidth={sideMenuWidth}
        editorContent={editorContent}
        fontFamily={fontFamily}
      />
      <BottomBar cursorPosition={cursorPosition} />
    </div>
  );
}

export default App;
