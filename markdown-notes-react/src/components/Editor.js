import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';

const Editor = ({ sideMenuWidth, tabBarHeight, height, onMouseDown }) => {
  const theme = useTheme();
  const [editorContent, setEditorContent] = useState("");

  return (
    <div
      style={{
        position: 'absolute',
        top: tabBarHeight,
        left: sideMenuWidth + 5,
        width: `calc(100% - ${sideMenuWidth + 5}px)`,
        height: height - 10,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        boxSizing: 'border-box',
        overflow: 'auto',
      }}
    >
      <textarea
        value={editorContent}
        onChange={(e) => setEditorContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const value = editorContent;

            const updatedValue = 
              value.substring(0, start) + '    ' + value.substring(end);

            setEditorContent(updatedValue);

            setTimeout(() => e.target.setSelectionRange(start + 4, start + 4), 0);
          }
        }}
        style={{
          width: '100%',
          height: '90%',
          padding: '20px',
          border: 'none',
          outline: 'none',
          resize: 'none',
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          fontSize: '16px',
          fontFamily: 'monospace',
          boxSizing: 'border-box',
        }}
        placeholder="Start typing your notes here..."
      />

      {/* Resizable handle */}
      <div
        onMouseDown={onMouseDown}
        style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          width: '100%',
          height: '5px',
          cursor: 'ns-resize',
          backgroundColor: theme.palette.divider,
        }}
      ></div>
    </div>
  );
};

export default Editor;