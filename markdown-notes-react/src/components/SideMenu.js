import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import { useTheme } from "@mui/material/styles";
import { Box, Button, TextField, Typography } from "@mui/material";

const SideMenu = ({
  notes,
  setNotes,
  width,
  onMouseDown,
  handleAddTabFromPage,
  closeAllTabs,
  activeNoteId,
  setActiveNoteId,
  setActivePageId,
  setNextPage,
  setModalOpen,
  unsavedChanges,
  tabBarRef
}) => {
  const theme = useTheme();
  const [expandedNote, setExpandedNote] = useState(null);
  const [contextMenu, setContextMenu] = useState(null); // { x, y, id, type }
  const [renameModal, setRenameModal] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null); // { id, type }
  const [newName, setNewName] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleToggle = (noteId) => {
    setExpandedNote((prev) => (prev === noteId ? null : noteId));
  };

  const handlePageClick = (page) => {
    const parentNote = notes.find((note) =>
      note.pages.some((p) => p.id === page.id)
    );
  
    if (parentNote) {
      if (parentNote.id !== activeNoteId) {
        if (unsavedChanges) {
          // Block tab addition until user confirms discard
          setNextPage(page);
          setModalOpen(true);
        } else {
          // Switch to new note and add the tab immediately
          closeAllTabs();
          setActiveNoteId(parentNote.id);
          handleAddTabFromPage(page);
        }
      } else {
        // Same note, just open the page
        handleAddTabFromPage(page);
      }
    }
  };  

  const handlePageClickAndSetActivePage = (page) => {
    handlePageClick(page); // Call your existing logic
    setActivePageId(page.id); // Separate the active page ID update
  };

  const handleContextMenu = (event, item, type) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      id: item.id,
      type, // 'note' or 'page'
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const openRenameModal = (id, type) => {
    setRenameTarget({ id, type });
    setRenameModal(true);
    setContextMenu(null);
  };

  const handleRenameConfirm = () => {
    if (!newName.trim()) return;
  
    setNotes((prevNotes) =>
      prevNotes.map((note) => {
        if (renameTarget.type === "note" && note.id === renameTarget.id) {
          return { ...note, title: newName };
        } else if (renameTarget.type === "page") {
          // Update the tab name through the ref
          tabBarRef.current.updateTab(renameTarget.id, newName);
  
          return {
            ...note,
            pages: note.pages.map((page) =>
              page.id === renameTarget.id ? { ...page, title: newName } : page
            ),
          };
        }
        return note;
      })
    );
  
    setRenameModal(false);
    setRenameTarget(null);
    setNewName("");
  };  

  const openDeleteModal = (id, type) => {
    setDeleteTarget({ id, type });
    setDeleteModal(true);
    setContextMenu(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;

    setNotes((prevNotes) => {
      if (deleteTarget.type === "note") {
        // Remove the entire note
        return prevNotes.filter((note) => note.id !== deleteTarget.id);
      } else if (deleteTarget.type === "page") {
        // Remove the page from the corresponding note
        return prevNotes.map((note) => {
          if (note.pages.some((page) => page.id === deleteTarget.id)) {
            return {
              ...note,
              pages: note.pages.filter((page) => page.id !== deleteTarget.id),
            };
          }
          return note;
        });
      }
      return prevNotes;
    });

    setDeleteModal(false);
    setDeleteTarget(null);
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 25px)" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: `${width}px`,
          flexShrink: 0,
          top: "20px",
          height: "calc(100vh - 45px)",
          "& .MuiDrawer-paper": {
            width,
            boxSizing: "border-box",
            top: "20px",
            height: "calc(100vh - 45px)",
          },
        }}
      >
        <List>
          {notes.map((note) => (
            <React.Fragment key={note.id}>
              <ListItem
                button
                onClick={() => handleToggle(note.id)}
                onContextMenu={(e) => handleContextMenu(e, note, "note")}
              >
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
                      onClick={() => handlePageClickAndSetActivePage(page)}
                      onContextMenu={(e) => handleContextMenu(e, page, "page")}
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
          backgroundColor: theme.palette.divider,
        }}
      ></div>

      {/* Custom Context Menu */}
      {contextMenu && (
        <Paper
          style={{
            position: "absolute",
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 1200,
          }}
          onMouseLeave={handleCloseContextMenu}
        >
          <MenuList>
            <MenuItem
              onClick={() => openRenameModal(contextMenu.id, contextMenu.type)}
            >
              Rename
            </MenuItem>
            <MenuItem
              onClick={() => openDeleteModal(contextMenu.id, contextMenu.type)}
            >
              Delete
            </MenuItem>
          </MenuList>
        </Paper>
      )}

      {/* Rename Modal */}
      <Modal open={renameModal} onClose={() => setRenameModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 1,
            boxShadow: 24,
          }}
        >
          <TextField
            label="Enter new name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleRenameConfirm}
            sx={{
              mr: 1,
            }}
          >
            Confirm
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setRenameModal(false)}
            sx={{
              backgroundColor: theme.palette.background.paper,
              color: "dimGray",
            }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
      {/* Delete Modal */}
      <Modal open={deleteModal} onClose={() => setDeleteModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 1,
            boxShadow: 24,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Really Delete?
          </Typography>
          <Button
            variant="contained"
            onClick={handleDeleteConfirm}
            sx={{
              mr: 1,
            }}
          >
            Confirm
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setDeleteModal(false)}
            sx={{
              backgroundColor: theme.palette.background.paper,
              color: "dimGray",
            }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default SideMenu;
