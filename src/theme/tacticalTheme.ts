import { createTheme, type Theme } from "@mui/material/styles";

/** Link/health status shared across the whole monitoring UI. */
export type LinkStatus = "good" | "marginal" | "poor";

declare module "@mui/material/styles" {
  interface Palette {
    status: Record<LinkStatus, string>;
    panel: { surface: string; header: string };
  }
  interface PaletteOptions {
    status?: Record<LinkStatus, string>;
    panel?: { surface: string; header: string };
  }
}

const MONO_STACK = '"IBM Plex Mono", ui-monospace, SFMono-Regular, monospace';

export const tacticalTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#4aa8ff", contrastText: "#0b1220" },
    secondary: { main: "#7f8ea8" },
    background: { default: "#101725", paper: "#1b2333" },
    text: { primary: "#e3eaf5", secondary: "#93a2b8" },
    divider: "#33405a",
    status: { good: "#35d07f", marginal: "#f2b544", poor: "#f2554a" },
    panel: { surface: "#141b28", header: "#1e2739" },
  },
  shape: { borderRadius: 3 },
  spacing: 4,
  typography: {
    fontFamily: MONO_STACK,
    fontSize: 12,
    button: { fontFamily: MONO_STACK, textTransform: "uppercase", letterSpacing: "0.16em" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { letterSpacing: "0.01em", overflow: "hidden" },
      },
    },
    MuiButtonBase: { defaultProps: { disableRipple: true } },
  },
});

/** Resolve a link status to its themed colour. */
export const statusColor = (theme: Theme, status: LinkStatus): string =>
  theme.palette.status[status];
