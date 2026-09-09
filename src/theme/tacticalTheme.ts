import { createTheme, type Theme } from "@mui/material/styles";

/** Link/health status shared across the whole monitoring UI. */
export type LinkStatus = "good" | "marginal" | "poor";

declare module "@mui/material/styles" {
  interface Palette {
    status: Record<LinkStatus, string>;
    panel: { surface: string; header: string; drawer: string };
    /** Saturated blue used for active / connected interactive states. */
    interactive: { main: string; glow: string };
  }
  interface PaletteOptions {
    status?: Record<LinkStatus, string>;
    panel?: { surface: string; header: string; drawer: string };
    interactive?: { main: string; glow: string };
  }
}

/**
 * Aligned with the Haluts Web Client design basics:
 * dark-mode only, primary #90CAF9, Exo typography,
 * 4px radius for small elements / 8px for cards & panels.
 */
const FONT_STACK = '"Exo", "Assistant", Arial, sans-serif';

export const tacticalTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#90CAF9", light: "#BBDEFB", dark: "#2477E8", contrastText: "#121212" },
    secondary: { main: "#C28FF4", contrastText: "#121212" },
    error: { main: "#F44336" },
    warning: { main: "#FFA726" },
    info: { main: "#29B6F6" },
    success: { main: "#66BB6A" },
    background: { default: "#303030", paper: "#424242" },
    text: {
      primary: "#FFFFFF",
      secondary: "rgba(255,255,255,0.7)",
      disabled: "rgba(255,255,255,0.5)",
    },
    divider: "rgba(255,255,255,0.12)",
    action: {
      hover: "rgba(255,255,255,0.08)",
      selected: "rgba(255,255,255,0.08)",
      disabled: "rgba(255,255,255,0.3)",
      disabledBackground: "rgba(255,255,255,0.12)",
    },
    status: { good: "#90CAF9", marginal: "#FFA726", poor: "#F44336" },
    panel: { surface: "#121212", header: "#212121", drawer: "#292929" },
    interactive: { main: "#2477E8", glow: "rgba(47,128,237,0.4)" },
  },
  /** 4px small elements; cards/panels opt into 8px via `borderRadius: 8`. */
  shape: { borderRadius: 4 },
  spacing: 4,
  typography: {
    fontFamily: FONT_STACK,
    fontSize: 12,
    h1: { fontFamily: FONT_STACK },
    h2: { fontFamily: FONT_STACK },
    h3: { fontFamily: FONT_STACK },
    h4: { fontFamily: FONT_STACK },
    h5: { fontFamily: FONT_STACK },
    h6: { fontFamily: FONT_STACK },
    body1: { fontSize: "0.875rem" },
    body2: { fontSize: "0.75rem" },
    caption: { fontSize: "0.75rem" },
    button: {
      fontFamily: FONT_STACK,
      fontSize: "0.75rem",
      textTransform: "uppercase",
      letterSpacing: "0.12em",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { letterSpacing: "0.01em", overflow: "hidden" },
        /** Shared thin scrollbar from the design basics. */
        "*::-webkit-scrollbar": { width: 5, height: 5 },
        "*::-webkit-scrollbar-thumb": { backgroundColor: "#9E9E9E", borderRadius: 12 },
        "*::-webkit-scrollbar-track": { backgroundColor: "transparent" },
      },
    },
    MuiButtonBase: { defaultProps: { disableRipple: true } },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          minHeight: 32,
          transition: "transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease",
          "&:hover": { transform: "translateY(-1px)" },
          "&.Mui-disabled": { opacity: 0.45, cursor: "not-allowed" },
        },
      },
    },
    MuiIconButton: { styleOverrides: { root: { borderRadius: 4 } } },
    MuiPaper: { styleOverrides: { rounded: { borderRadius: 8 } } },
    MuiDialog: {
      styleOverrides: { paper: { borderRadius: 8, boxShadow: "0 8px 18px rgba(0,0,0,0.35)" } },
    },
    MuiTooltip: {
      defaultProps: { enterDelay: 600, leaveDelay: 150, placement: "bottom", arrow: true },
      styleOverrides: {
        tooltip: { borderRadius: 4, backgroundColor: "#333", fontSize: "0.75rem" },
        arrow: { color: "#333" },
      },
    },
    MuiTextField: { defaultProps: { variant: "outlined", size: "small" } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 4, backgroundColor: "rgba(255,255,255,0.09)" },
        notchedOutline: { borderColor: "rgba(255,255,255,0.23)" },
      },
    },
  },
});

/** Resolve a link status to its themed colour. */
export const statusColor = (theme: Theme, status: LinkStatus): string =>
  theme.palette.status[status];
