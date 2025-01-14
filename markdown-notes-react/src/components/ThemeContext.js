import React, { createContext, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#D3D3D3", light: "#E0E0E0", dark: "#BDBDBD" },
    background: { default: "#ffffff", paper: "#f5f5f5" },
    text: { primary: "#000000" }, // Add text colors
    divider: "#D3D3D3",
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#2C2C2C", light: "232323", dark: "#565656" },
    background: { default: "#2c2c2c", paper: "#222223" },
    text: { primary: "#ffffff" }, // Add text colors
    divider: "#363637"
  },
});

export const ThemeContext = createContext();

export const ThemeProviderWrapper = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};