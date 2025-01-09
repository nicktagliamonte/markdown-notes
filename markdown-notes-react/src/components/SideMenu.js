import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const SideMenu = ({ notes, width, onMouseDown }) => {
  const [expandedNote, setExpandedNote] = useState(null);

  const handleToggle = (noteId) => {
    setExpandedNote((prev) => (prev === noteId ? null : noteId));
  };

  return (
    <div
      style={{ display: "flex", height: "calc(100vh)" }}
    >
      <Drawer
        variant="permanent"
        sx={{
          width: `${width}px`,
          flexShrink: 0,
          top: "20px", // Start 20px from the top
          height: "calc(100vh - 20px)", // Ensure it fills the remaining height
          "& .MuiDrawer-paper": {
            width,
            boxSizing: "border-box",
            top: "20px", // Ensure the paper aligns with the drawer
            height: "calc(100vh - 20px)",
          },
        }}
      >
        <List>
          {notes.map((note) => (
            <React.Fragment key={note.id}>
              <ListItem button onClick={() => handleToggle(note.id)}>
                <ListItemText primary={note.title} />
                <IconButton size="small">
                  {expandedNote === note.id ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
              </ListItem>
              <Collapse
                in={expandedNote === note.id}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {note.pages.map((page) => (
                    <ListItem
                      key={page.id}
                      sx={{ pl: 4 }}
                      button
                      onClick={() => console.log(`Open page ${page.title}`)}
                    >
                      <ListItemText primary={page.title} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      </Drawer>
      {/* Resizable Handle */}
      <div
        onMouseDown={onMouseDown}
        style={{
          width: "5px",
          cursor: "ew-resize",
          backgroundColor: "#ddd",
        }}
      ></div>
    </div>
  );
};

export default SideMenu;