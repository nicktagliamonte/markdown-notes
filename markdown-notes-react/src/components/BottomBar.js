import React from "react";
import { useTheme } from "@mui/material/styles";

const BottomBar = () => {
  const theme = useTheme();

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "25px",
        zIndex: 1,
        backgroundColor: theme.palette.divider,
        color: theme.palette.text.primary,
        display: "flex",
        alignItems: "center",
        paddingLeft: "10px",
        fontSize: "14px", // Adjust size as needed
      }}
    >
      Line: 1, Column: 1 {/* Placeholder text */}
    </div>
  );
};

export default BottomBar;