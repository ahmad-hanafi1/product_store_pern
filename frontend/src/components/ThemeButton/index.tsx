import { IconButton, useTheme } from "@mui/material";
import {
  WbSunnyOutlined as SunIcon,
  ModeNightOutlined as MoonIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeContext } from "../../context/ThemeContext";

/**
 * An animated IconButton that toggles between light and dark themes.
 */
export const ThemeButton = () => {
  const { toggleTheme, themeMode } = useThemeContext();
  const theme = useTheme();

  return (
    <IconButton
      onClick={toggleTheme}
      aria-label="toggle theme"
      sx={{ width: 48, height: 48, bgcolor: theme.palette.secondary.main }} // Ensure the button has a fixed size
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
          key={themeMode}
          // Animation properties
          initial={{ y: -20, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 20, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {themeMode === "dark" ? <SunIcon /> : <MoonIcon />}
        </motion.div>
      </AnimatePresence>
    </IconButton>
  );
};
