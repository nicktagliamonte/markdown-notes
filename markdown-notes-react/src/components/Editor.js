import React from 'react';
import { useTheme } from '@mui/material/styles';

const Editor = ({ sideMenuWidth, tabBarHeight, height, onMouseDown }) => {
  const theme = useTheme();

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
      <div
        style={{
          height: '90%',
          padding: 20,
        }}
      >
        {/* Editor content */}
        <h1>Editor</h1>
        <p>This is where the user can edit content.</p>
      </div>

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