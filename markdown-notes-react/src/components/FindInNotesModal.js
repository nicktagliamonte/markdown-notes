import React from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Button, TextField, Typography } from "@mui/material";

const FindInNotesModal = ({ isOpen, onClose }) => {
  const theme = useTheme();

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "-50%",
        left: 0,
        width: "100vw",
        height: "150vh",
        zIndex: theme.zIndex.modal,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[5],
          padding: theme.spacing(3), // Even padding
          width: "300px",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Find In Notes
        </Typography>
        <TextField 
          placeholder="Enter search term..." 
          fullWidth 
          size="small" 
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: theme.spacing(2),
          }}
        >
          <Button 
            variant="contained" 
            onClick={onClose}
            sx={{ width: "48%" }}
          >
            Find
          </Button>
          <Button 
            variant="contained" 
            onClick={onClose}
            sx={{ width: "48%" }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default FindInNotesModal;