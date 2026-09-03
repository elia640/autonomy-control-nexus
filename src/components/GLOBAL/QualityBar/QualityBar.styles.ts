import { alpha, styled } from "@mui/material/styles";

export const QualityBarTrack = styled("div", {
  shouldForwardProp: (prop) => prop !== "muted",
})<{ muted?: boolean | undefined }>(({ theme, muted }) => ({
  position: "relative",
  height: 16,
  width: "100%",
  overflow: "hidden",
  borderRadius: 999,
  /** High-contrast empty track so the unfilled remainder reads clearly. */
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${alpha(theme.palette.divider, 0.9)}`,
  boxShadow: `inset 0 0 0 1px ${alpha(theme.palette.background.default, 0.9)}`,
  opacity: muted ? 0.55 : 1,
}));

export const QualityBarFill = styled("div", {
  shouldForwardProp: (prop) => prop !== "fillColor",
})<{ fillColor: string }>(({ theme, fillColor }) => ({
  height: "100%",
  borderRadius: 999,
  transition: theme.transitions.create(["width", "background-color"]),
  backgroundColor: fillColor,
  boxShadow: `0 0 6px ${alpha(fillColor, 0.45)}`,
}));

/** Percentage rendered inside the track, centred over the fill. */
export const QualityBarValue = styled("span", {
  shouldForwardProp: (prop) => prop !== "tone",
})<{ tone: string }>(({ tone }) => ({
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.6875rem",
  fontWeight: 700,
  letterSpacing: "0.04em",
  fontVariantNumeric: "tabular-nums",
  color: tone,
  textShadow: "0 1px 2px rgba(0,0,0,0.85)",
  pointerEvents: "none",
}));
