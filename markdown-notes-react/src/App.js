import React, { useState, useEffect } from "react";
import FindModal from "./components/FindModal";
import ReplaceModal from "./components/ReplaceModal";
import FindInNotesModal from "./components/FindInNotesModal";
import ReplaceInNotesModal from "./components/ReplaceInNotesModal";
import TopMenu from "./components/TopMenu";
import SideMenu from "./components/SideMenu";
import TabBar from "./components/TabBar";
import Editor from "./components/Editor";
import Preview from "./components/Preview";
import BottomBar from "./components/BottomBar";

function App() {
  // Notes
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "Note 1",
      pages: [
        { id: 1, title: "Page 1", content: "" },
        { id: 2, title: "Page 2", content: "" },
      ],
    },
    {
      id: 2,
      title: "Note 2",
      pages: [
        { id: 3, title: "Page 1", content: "" },
        { id: 4, title: "Page 2", content: "" },
        { id: 5, title: "Page 3", content: "" },
      ],
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

  // FindModal Handlers
  const [isFindModalOpen, setFindModalOpen] = useState(false);
  const handleOpenFind = () => setFindModalOpen(true);
  const handleCloseFind = () => setFindModalOpen(false);

  // ReplaceModal Handlers
  const [isReplaceModalOpen, setReplaceModalOpen] = useState(false);
  const handleOpenReplace = () => setReplaceModalOpen(true);
  const handleCloseReplace = () => setReplaceModalOpen(false);

  // FindInNotesModal Handlers
  const [isFindInNotesModalOpen, setFindInNotesModalOpen] = useState(false);
  const handleOpenFindInNotes = () => setFindInNotesModalOpen(true);
  const handleCloseFindInNotes = () => setFindInNotesModalOpen(false);

  // ReplaceInNotesModal Handlers
  const [isReplacInNoteseModalOpen, setReplaceInNotesModalOpen] =
    useState(false);
  const handleOpenReplaceInNotes = () => setReplaceInNotesModalOpen(true);
  const handleCloseReplaceInNotes = () => setReplaceInNotesModalOpen(false);

  // FilePath and Save Handlers
  const [currentFilePath, setCurrentFilePath] = useState(null);

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
      const handle = await window.showSaveFilePicker(options);
      const writable = await handle.createWritable();
      await writable.write(JSON.stringify(notes, null, 2));
      await writable.close();
      setCurrentFilePath(handle); // Save the file handle for future saves
      alert("File saved successfully!");
    } catch (error) {
      console.error("Error saving file:", error);
      alert("Failed to save file.");
    }
  };  

  const handleSave = async () => {
    if (!currentFilePath) {
      handleSaveAs();
    }
    try {
      const writable = await currentFilePath.createWritable();
      await writable.write(JSON.stringify(notes, null, 2));
      await writable.close();
      alert("File saved successfully!");
    } catch (error) {
      console.error("Error saving file:", error);
      alert("Failed to save file.");
    }
  };

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
    note.pages.every((page) => page.id && typeof page.title === "string" && typeof page.content === "string");  

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

  return (
    <div>
      <TopMenu
        onOpenFind={handleOpenFind}
        onOpenReplace={handleOpenReplace}
        onOpenFindInNotes={handleOpenFindInNotes}
        onOpenReplaceInNotes={handleOpenReplaceInNotes}
        handleSaveAs={handleSaveAs}
        handleSave={handleSave}
        handleOpen={handleOpen}
      />
      <FindModal isOpen={isFindModalOpen} onClose={handleCloseFind} />
      <ReplaceModal isOpen={isReplaceModalOpen} onClose={handleCloseReplace} />
      <FindInNotesModal
        isOpen={isFindInNotesModalOpen}
        onClose={handleCloseFindInNotes}
      />
      <ReplaceInNotesModal
        isOpen={isReplacInNoteseModalOpen}
        onClose={handleCloseReplaceInNotes}
      />
      <SideMenu
        notes={notes}
        width={sideMenuWidth}
        onMouseDown={handleMouseDownMenu}
      />
      <TabBar sideMenuWidth={sideMenuWidth} />
      <Editor
        sideMenuWidth={sideMenuWidth}
        tabBarHeight={tabBarHeight}
        height={height}
        onMouseDown={handleMouseDownEditor}
      />
      <Preview editorHeight={height} sideMenuWidth={sideMenuWidth} />
      <BottomBar />
    </div>
  );
}

export default App;