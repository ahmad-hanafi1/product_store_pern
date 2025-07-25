import { createTheme } from "@mui/material/styles";

// Your core colors
const primaryColor = "#EA2831";
const textColorPrimary = "#171212";
const formBackgroundColor = "#F5F0F0";
const formTextColor = "#876363";

// --- LIGHT THEME ---
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: "#4A5568",
    },
    background: {
      // 1. Reset the default background to white
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },
    text: {
      primary: textColorPrimary,
      secondary: "#5A5A5A",
    },
    error: {
      main: "#D32F2F",
    },
    warning: {
      main: "#FFA000",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition:
            "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
        },
        "*": {
          transition:
            "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.primary,
          "&.Mui-selected": {
            color: theme.palette.primary.main,
          },
        }),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            // 2. Apply the specific form background color here
            backgroundColor: formBackgroundColor,
            "& .MuiInputBase-input": {
              color: formTextColor,
            },
            "& fieldset": {
              borderColor: "#D0C5C5",
            },
            "&:hover fieldset": {
              borderColor: primaryColor,
            },
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.primary,
          textDecoration: "none",
          "&.active": {
            color: theme.palette.primary.main,
          },
        }),
      },
    },
  },
});

// --- DARK THEME ---
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#F55A62", // A slightly brighter, more vibrant red for dark mode
    },
    secondary: {
      main: "#A0AEC0", // A lighter gray for accents
    },
    background: {
      default: textColorPrimary, // Your specified black as the main background
      paper: "#2D2626", // A dark, slightly reddish-gray for cards
    },
    text: {
      primary: "#F5F5F5", // A clean off-white for primary text
      secondary: "#A99898", // A muted, reddish-gray for secondary text
    },
    error: {
      main: "#EF5350",
    },
    warning: {
      main: "#FFB74D",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition: "background-color 0.3s ease-in, color 0.3s ease-in",
        },
        "*": {
          transition: "background-color 0.3s ease-in, color 0.3s ease-in",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.primary,
          "&.Mui-selected": {
            color: theme.palette.primary.main,
          },
        }),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#2D2626",
            "& .MuiInputBase-input": {
              color: "#E0D6D6",
            },
            "& fieldset": {
              borderColor: "#5A4D4D",
            },
            "&:hover fieldset": {
              borderColor: "#F55A62",
            },
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.primary,
          textDecoration: "none",
          "&.active": {
            color: theme.palette.primary.main,
          },
        }),
      },
    },
  },
});
