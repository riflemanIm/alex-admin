import React from "react";
import Themes from "../themes";

const ThemeStateContext = React.createContext();
const ThemeDispatchContext = React.createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = React.useState(
    Themes[localStorage.getItem("theme")] || Themes.default
  );
  return (
    <ThemeStateContext.Provider value={theme}>
      <ThemeDispatchContext.Provider value={setTheme}>
        {children}
      </ThemeDispatchContext.Provider>
    </ThemeStateContext.Provider>
  );
}

function useThemeState() {
  const context = React.useContext(ThemeStateContext);
  if (context === undefined) {
    throw new Error("useThemeState must be used within a ThemeProvider");
  }
  return context;
}

function useThemeDispatch() {
  const context = React.useContext(ThemeDispatchContext);
  if (context === undefined) {
    throw new Error("useThemeDispatch must be used within a ThemeProvider");
  }
  return context;
}

export { ThemeProvider, useThemeState, useThemeDispatch, ThemeStateContext };
