import React from "react";
import TopMenu from "./components/TopMenu";
import SideMenu from "./components/SideMenu";

const mockNotes = [
  {
    id: 1,
    title: "Note 1",
    tabs: [
      { id: 1, title: "Tab 1" },
      { id: 2, title: "Tab 2" },
    ],
  },
  {
    id: 2,
    title: "Note 2",
    tabs: [
      { id: 3, title: "Tab 1" },
      { id: 4, title: "Tab 2" },
      { id: 5, title: "Tab 3" },
    ],
  },
];

function App() {
  return (
    <div>
      <TopMenu />
      <SideMenu notes={mockNotes} />
    </div>
  );
}

export default App;