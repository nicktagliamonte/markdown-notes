import React, { createContext, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#D3D3D3" },
    background: { default: "#ffffff" },
    text: { primary: "#000000" }, // Add text colors
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#2C2C2C" },
    background: { default: "#121212" },
    text: { primary: "#ffffff" }, // Add text colors
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
