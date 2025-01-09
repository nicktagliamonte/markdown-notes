import React, { useState, useEffect } from "react";
import TopMenu from "./components/TopMenu";
import SideMenu from "./components/SideMenu";
import TabBar from "./components/TabBar";
import Editor from "./components/Editor";

const mockNotes = [
  {
    id: 1,
    title: "Note 1",
    pages: [
      // Updated from 'tabs' to 'pages'
      { id: 1, title: "Page 1" },
      { id: 2, title: "Page 2" },
    ],
  },
  {
    id: 2,
    title: "Note 2",
    pages: [
      // Updated from 'tabs' to 'pages'
      { id: 3, title: "Page 1" },
      { id: 4, title: "Page 2" },
      { id: 5, title: "Page 3" },
    ],
  },
];

function App() {
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

  const [tabBarHeight] = useState(70); // Fixed TabBar height

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
      <TopMenu />
      <SideMenu 
        notes={mockNotes}
        width={sideMenuWidth} 
        onMouseDown={handleMouseDownMenu} />
      <TabBar sideMenuWidth={sideMenuWidth} />
      <Editor
        sideMenuWidth={sideMenuWidth}
        tabBarHeight={tabBarHeight}
        height={height}
        onMouseDown={handleMouseDownEditor}
      />
    </div>
  );
}

export default App;