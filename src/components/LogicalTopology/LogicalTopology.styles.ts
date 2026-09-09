import { alpha, styled } from "@mui/material/styles";

export const TopologyRoot = styled("div")(({ theme }) => ({
  position: "absolute",
  inset: 0,
  overflow: "auto",
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(9, 4, 8),
}));

/** Positioning context for the measured connection layer. */
export const TopologyContent = styled("div")({
  position: "relative",
  minHeight: "100%",
  minWidth: "100%",
  width: "max-content",
});

export const EdgeSvg = styled("svg")({
  position: "absolute",
  left: 0,
  top: 0,
  pointerEvents: "none",
  overflow: "visible",
});

/** Three logical layers: platforms, intermediate nodes, control room. */
export const LayerGrid = styled("div")(({ theme }) => ({
  position: "relative",
  display: "grid",
  gridTemplateColumns: "minmax(200px, 260px) minmax(160px, 200px) minmax(220px, 280px)",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(0, 14),
  minHeight: "100%",
}));

export const LayerColumn = styled("div")(({ theme }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "center",
  gap: theme.spacing(4),
}));

export const LayerCaption = styled("div")(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(-4.5),
  left: 0,
  right: 0,
  textAlign: "center",
  fontSize: "0.75rem",
  fontWeight: 700,
  letterSpacing: "0.22em",
  color: theme.palette.text.secondary,
}));

/** Wraps a platform card so it can be dimmed when another route is highlighted. */
export const NodeSlot = styled("div", {
  shouldForwardProp: (prop) => prop !== "dimmed",
})<{ dimmed?: boolean }>(({ dimmed }) => ({
  display: "flex",
  justifyContent: "stretch",
  opacity: dimmed ? 0.3 : 1,
  transition: "opacity 160ms ease",
  "& > div": { width: "100%" },
}));

/** Caption above each platform card describing how it reaches the control room. */
export const RouteTag = styled("span", {
  shouldForwardProp: (prop) => prop !== "labelColor",
})<{ labelColor: string }>(({ theme, labelColor }) => ({
  display: "inline-block",
  marginBottom: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(labelColor, 0.6)}`,
  backgroundColor: alpha(labelColor, 0.12),
  padding: "1px 6px",
  fontSize: "0.75rem",
  letterSpacing: "0.1em",
  color: labelColor,
}));

/** Intermediate hop (relay unit / vehicle acting as a relay). */
export const HopNode = styled("div", {
  shouldForwardProp: (prop) => prop !== "accent" && prop !== "dimmed",
})<{ accent: string; dimmed?: boolean }>(({ theme, accent, dimmed }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(0.75),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(accent, 0.8)}`,
  backgroundColor: alpha(accent, 0.1),
  boxShadow: `0 0 14px ${alpha(accent, 0.18)}`,
  padding: theme.spacing(2, 2),
  fontSize: "0.8125rem",
  fontWeight: 700,
  letterSpacing: "0.14em",
  color: accent,
  opacity: dimmed ? 0.3 : 1,
  transition: "opacity 160ms ease",
  "& .MuiSvgIcon-root": { fontSize: "1rem" },
}));

export const HopRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

export const HopCaption = styled("span")(({ theme }) => ({
  fontSize: "0.75rem",
  fontWeight: 400,
  letterSpacing: "0.1em",
  color: theme.palette.text.secondary,
}));

/** Control room frame — deliberately heavier than the platform cards. */
export const CommandNode = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  gap: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  border: `2px solid ${theme.palette.primary.main}`,
  outline: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
  outlineOffset: 3,
  boxShadow: `0 0 18px ${alpha(theme.palette.primary.main, 0.35)}`,
  backgroundColor: theme.palette.panel.header,
  padding: theme.spacing(2.5, 2.5),
  cursor: "pointer",
  fontSize: "0.875rem",
  fontWeight: 700,
  letterSpacing: "0.18em",
  color: theme.palette.primary.main,
  "& .MuiSvgIcon-root": { fontSize: "1rem" },
}));

export const CommandRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(1.5),
}));

export const CommandCaption = styled("span")(({ theme }) => ({
  textAlign: "center",
  fontSize: "0.75rem",
  fontWeight: 400,
  letterSpacing: "0.14em",
  color: theme.palette.text.secondary,
}));

/** Router unit inside the control room; every platform line terminates here. */
export const RouterModule = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  width: "100%",
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.9)}`,
  backgroundColor: alpha(theme.palette.primary.main, 0.18),
  padding: theme.spacing(1.25, 1.5),
  fontSize: "0.8125rem",
  fontWeight: 700,
  letterSpacing: "0.12em",
  color: theme.palette.primary.light,
  "& .MuiSvgIcon-root": { fontSize: "0.95rem" },
}));

/** Internal modem module of the control room. */
export const ModemModule = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  width: "100%",
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.6)}`,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  padding: theme.spacing(1, 1.5),
  fontSize: "0.8125rem",
  fontWeight: 400,
  letterSpacing: "0.12em",
  color: theme.palette.primary.light,
  "& .MuiSvgIcon-root": { fontSize: "0.9rem" },
}));

export const ModemMeta = styled("span")(({ theme }) => ({
  marginLeft: "auto",
  fontSize: "0.75rem",
  fontWeight: 400,
  letterSpacing: "0.08em",
  color: theme.palette.text.secondary,
}));

export const SatelliteNode = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  padding: theme.spacing(1, 2),
  fontSize: "0.8125rem",
  letterSpacing: "0.14em",
  color: theme.palette.primary.main,
  "& .MuiSvgIcon-root": { fontSize: "0.95rem" },
}));

/** Legend for line colouring and status. */
export const Legend = styled("div")(({ theme }) => ({
  position: "absolute",
  left: theme.spacing(1),
  bottom: theme.spacing(1),
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: alpha(theme.palette.background.paper, 0.85),
  padding: theme.spacing(0.75, 1.5),
  fontSize: "0.75rem",
  letterSpacing: "0.08em",
  color: theme.palette.text.secondary,
}));

export const LegendItem = styled("span")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
}));

export const LegendSwatch = styled("span", {
  shouldForwardProp: (prop) => prop !== "swatchColor" && prop !== "dashed",
})<{ swatchColor: string; dashed?: boolean }>(({ swatchColor, dashed }) => ({
  width: 18,
  height: 0,
  borderTop: `2px ${dashed ? "dashed" : "solid"} ${swatchColor}`,
}));
