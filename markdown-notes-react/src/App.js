/* eslint-disable react-hooks/exhaustive-deps */
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

  const [modals, setModals] = useState({
    find: false,
    replace: false,
    findInNotes: false,
    replaceInNotes: false,
  });

  const openModal = (modal) =>
    setModals((prev) => ({ ...prev, [modal]: true }));
  const closeModal = (modal) =>
    setModals((prev) => ({ ...prev, [modal]: false }));

  // FilePath and Save Handlers
  const [currentFilePath, setCurrentFilePath] = useState(null);

  const saveFile = async (fileHandle, content) => {
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
  };
  
  const handleSaveAs = async () => {
    try {
      const options = {
        suggestedName: "notes.json",
        types: [
          { description: "JSON Files", accept: { "application/json": [".json"] } },
        ],
      };
      const fileHandle = await window.showSaveFilePicker(options);
      await saveFile(fileHandle, JSON.stringify(notes, null, 2));
      setCurrentFilePath(fileHandle);
      alert("File saved successfully!");
    } catch (error) {
      console.error("Error saving file:", error);
      alert("Failed to save file.");
    }
  };
  
  const handleSave = async () => {
    if (!currentFilePath) return handleSaveAs();
    try {
      await saveFile(currentFilePath, JSON.stringify(notes, null, 2));
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

  // EditorContent
  const [editorContent, setEditorContent] = useState(""); // Shared state

  return (
    <div>
      <TopMenu
        onOpenFind={() => openModal("find")}
        onOpenReplace={() => openModal("replace")}
        onOpenFindInNotes={() => openModal("findInNotes")}
        onOpenReplaceInNotes={() => openModal("replaceInNotes")}
        handleSaveAs={handleSaveAs}
        handleSave={handleSave}
        handleOpen={handleOpen}
      />
      <FindModal isOpen={modals.find} onClose={() => closeModal("find")} />
      <ReplaceModal isOpen={modals.replace} onClose={() => closeModal("replace")} />
      <FindInNotesModal isOpen={modals.findInNotes} onClose={() => closeModal("findInNotes")} />
      <ReplaceInNotesModal isOpen={modals.replaceInNotes} onClose={() => closeModal("replaceInNotes")} />
      <SideMenu notes={notes} width={sideMenuWidth} onMouseDown={handleMouseDownMenu} />
      <TabBar sideMenuWidth={sideMenuWidth} />
      <Editor
        sideMenuWidth={sideMenuWidth}
        tabBarHeight={tabBarHeight}
        height={height}
        onMouseDown={handleMouseDownEditor}
        editorContent={editorContent} 
        setEditorContent={setEditorContent} 
      />
      <Preview editorHeight={height} sideMenuWidth={sideMenuWidth} editorContent={editorContent}/>
      <BottomBar />
    </div>
  );
}

export default App;