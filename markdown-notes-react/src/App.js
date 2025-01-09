import React, { useState } from "react";
import TopMenu from "./components/TopMenu";
import SideMenu from "./components/SideMenu";
import TabBar from "./components/TabBar";

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

const App = () => {
  const [sideMenuWidth, setSideMenuWidth] = useState(240); // Default width

  return (
    <>
      <TopMenu />
      <SideMenu notes={mockNotes} onWidthChange={setSideMenuWidth} />
      <TabBar sideMenuWidth={sideMenuWidth} />
    </>
  );
};

export default App;
