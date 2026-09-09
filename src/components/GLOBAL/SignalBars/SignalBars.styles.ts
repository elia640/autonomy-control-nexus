import { alpha, styled } from "@mui/material/styles";

export const BarsRoot = styled("span")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
  minWidth: 0,
}));

/** Cellular-reception style ladder: fixed, very narrow footprint. */
export const BarsTrack = styled("span")({
  display: "inline-flex",
  alignItems: "flex-end",
  gap: 1.5,
  height: 12,
});

export const Bar = styled("span", {
  shouldForwardProp: (prop) => prop !== "filled" && prop !== "tone" && prop !== "level",
})<{ filled: boolean; tone: string; level: number }>(({ theme, filled, tone, level }) => ({
  width: 3,
  borderRadius: 1,
  /** Ascending notches, tallest on the right. */
  height: 4 + level * 2,
  backgroundColor: filled ? tone : alpha(theme.palette.text.secondary, 0.22),
  boxShadow: filled ? `0 0 4px ${alpha(tone, 0.5)}` : "none",
  transition: theme.transitions.create(["background-color"]),
}));

export const BarsValue = styled("span", {
  shouldForwardProp: (prop) => prop !== "tone",
})<{ tone: string }>(({ tone }) => ({
  fontSize: "0.6875rem",
  fontWeight: 700,
  letterSpacing: "0.02em",
  fontVariantNumeric: "tabular-nums",
  color: tone,
  whiteSpace: "nowrap",
}));
