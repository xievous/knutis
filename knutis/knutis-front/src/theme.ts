import { createTheme } from "@mui/material/styles";

// Bright, friendly green is the signature color. The canvas is a soft
// green-tinted off-white so the green reads as warm rather than clinical.
const green = {
  main: "#2E9E5B",
  dark: "#1F7A45",
  light: "#5FC98A",
  soft: "#E7F3EA",
  contrastText: "#FFFFFF",
};

const ink = {
  primary: "#173527",
  secondary: "#5C7165",
};

const serif = "'Fraunces', 'Georgia', serif";
const sans = "'Outfit', 'Helvetica Neue', system-ui, sans-serif";

const theme = createTheme({
  shape: { borderRadius: 12 },
  palette: {
    mode: "light",
    primary: green,
    secondary: { main: "#46695A", contrastText: "#FFFFFF" },
    error: { main: "#C24A4A" },
    success: { main: green.main },
    background: { default: "#F4F9F1", paper: "#FFFFFF" },
    text: { primary: ink.primary, secondary: ink.secondary },
    divider: "#E2EBDD",
  },
  typography: {
    fontFamily: sans,
    h1: { fontFamily: serif, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.05 },
    h2: { fontFamily: serif, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1 },
    h3: { fontFamily: serif, fontWeight: 600, letterSpacing: "-0.015em", lineHeight: 1.12 },
    h4: { fontFamily: serif, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.15 },
    h5: { fontFamily: serif, fontWeight: 600, letterSpacing: "-0.01em" },
    h6: { fontFamily: serif, fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600, letterSpacing: 0 },
    body1: { lineHeight: 1.6 },
    body2: { lineHeight: 1.6 },
    overline: { letterSpacing: "0.12em", fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#F4F9F1",
          // Very soft radial wash so large sections never feel flat.
          backgroundImage:
            "radial-gradient(900px circle at 12% -8%, rgba(95,201,138,0.16), transparent 55%), radial-gradient(700px circle at 100% 0%, rgba(46,158,91,0.08), transparent 45%)",
          backgroundAttachment: "fixed",
        },
        "*": { scrollBehavior: "smooth" },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: "none" } },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingInline: 18,
          paddingBlock: 9,
          transition: "transform 160ms ease, background-color 160ms ease, border-color 160ms ease",
          "&:active": { transform: "scale(0.97)" },
        },
        outlined: { borderColor: "#CBDAC8" },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: "1px solid #E2EBDD",
          boxShadow: "none",
          backgroundColor: "#FFFFFF",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: "#FFFFFF",
          "& fieldset": { borderColor: "#D7E3D3" },
          "&:hover fieldset": { borderColor: "#B6CBB1" },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, letterSpacing: "0.02em" },
      },
    },
  },
});

export default theme;
