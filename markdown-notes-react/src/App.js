import React from "react";
import TopMenu from "./components/TopMenu";
import SideMenu from "./components/SideMenu";

const mockNotes = [
  {
    id: 1,
    title: "Note 1",
    pages: [  // Updated from 'tabs' to 'pages'
      { id: 1, title: "Page 1" },
      { id: 2, title: "Page 2" },
    ],
  },
  {
    id: 2,
    title: "Note 2",
    pages: [  // Updated from 'tabs' to 'pages'
      { id: 3, title: "Page 1" },
      { id: 4, title: "Page 2" },
      { id: 5, title: "Page 3" },
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