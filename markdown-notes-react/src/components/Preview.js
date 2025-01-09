import React from "react";
import { useTheme } from '@mui/material/styles';

const MarkdownPreview = ({ editorHeight, sideMenuWidth }) => {
    const theme = useTheme();

  return (
    <div
      className="markdown-preview"
      style={{
        position: "absolute",
        top: editorHeight + 60,
        left: sideMenuWidth + 5,
        width: `calc(97.5% - ${sideMenuWidth}px)`,
        height: `calc(96.5% - ${editorHeight}px - 25px)`,
        overflow: "auto",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        padding: "10px",
      }}
    >
      <h3>Markdown Preview</h3>
      {/* Render the markdown preview here */}
    </div>
  );
};

export default MarkdownPreview;
