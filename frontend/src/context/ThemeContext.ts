import { createContext, useContext } from "react";

// Create a context with a default value
export const ThemeContext = createContext({
  toggleTheme: () => {}, 
  themeMode: "light", 
});

// Create and export the custom hook
export const useThemeContext = () => useContext(ThemeContext);
