import { alpha, styled } from "@mui/material/styles";

export const TopologyRoot = styled("div")(({ theme }) => ({
  position: "absolute",
  inset: 0,
  overflow: "auto",
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(10, 4, 6),
}));

/** Positioning context for the measured connection layer. */
export const TopologyContent = styled("div")({
  position: "relative",
  minHeight: "100%",
  width: "100%",
});

export const EdgeSvg = styled("svg")({
  position: "absolute",
  left: 0,
  top: 0,
  pointerEvents: "none",
  overflow: "visible",
});

/** Three layers: vehicles, intermediate nodes, command post. */
export const LayerGrid = styled("div")(({ theme }) => ({
  position: "relative",
  display: "grid",
  gridTemplateColumns: "auto minmax(140px, 220px) auto",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(0, 10),
  minHeight: "100%",
}));

export const LayerColumn = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(6),
}));

export const LayerCaption = styled("div")(({ theme }) => ({
  marginBottom: theme.spacing(2),
  textAlign: "center",
  fontSize: "0.6875rem",
  fontWeight: 700,
  letterSpacing: "0.22em",
  color: theme.palette.text.secondary,
}));

/** A group of vehicles that share one pathway to the command post. */
export const Cluster = styled("div", {
  shouldForwardProp: (prop) => prop !== "accent",
})<{ accent: string }>(({ theme, accent }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: `1px dashed ${alpha(accent, 0.5)}`,
  backgroundColor: alpha(accent, 0.05),
  padding: theme.spacing(2, 2.5),
}));

export const ClusterTitle = styled("div", {
  shouldForwardProp: (prop) => prop !== "accent",
})<{ accent: string }>(({ accent }) => ({
  fontSize: "0.6875rem",
  fontWeight: 700,
  letterSpacing: "0.18em",
  color: accent,
}));

export const ClusterMembers = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

/** Wraps a vehicle card so it can be dimmed when another path is highlighted. */
export const NodeSlot = styled("div", {
  shouldForwardProp: (prop) => prop !== "dimmed",
})<{ dimmed?: boolean }>(({ dimmed }) => ({
  display: "flex",
  justifyContent: "center",
  opacity: dimmed ? 0.35 : 1,
  transition: "opacity 160ms ease",
}));

export const HopNode = styled("div", {
  shouldForwardProp: (prop) => prop !== "accent" && prop !== "dimmed",
})<{ accent: string; dimmed?: boolean }>(({ theme, accent, dimmed }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(0.5),
  minWidth: 132,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(accent, 0.8)}`,
  backgroundColor: alpha(accent, 0.1),
  padding: theme.spacing(1.5, 2),
  fontSize: "0.6875rem",
  fontWeight: 700,
  letterSpacing: "0.16em",
  color: accent,
  opacity: dimmed ? 0.35 : 1,
  transition: "opacity 160ms ease",
  "& .MuiSvgIcon-root": { fontSize: "0.9rem" },
}));

export const HopRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

export const HopCaption = styled("span")(({ theme }) => ({
  fontSize: "0.6875rem",
  fontWeight: 400,
  letterSpacing: "0.12em",
  color: theme.palette.text.secondary,
}));

/** Command post frame — deliberately heavier than the platform cards. */
export const CommandNode = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  border: `2px solid ${theme.palette.primary.main}`,
  outline: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
  outlineOffset: 3,
  boxShadow: `0 0 18px ${alpha(theme.palette.primary.main, 0.35)}`,
  backgroundColor: theme.palette.panel.header,
  padding: theme.spacing(2.5, 3),
  cursor: "pointer",
  fontSize: "0.6875rem",
  fontWeight: 700,
  letterSpacing: "0.2em",
  color: theme.palette.primary.main,
  "& .MuiSvgIcon-root": { fontSize: "1rem" },
}));

export const CommandRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
}));

export const CommandCaption = styled("span")(({ theme }) => ({
  fontSize: "0.6875rem",
  fontWeight: 400,
  letterSpacing: "0.16em",
  color: theme.palette.text.secondary,
}));

/** Internal modem module of the command post; lines terminate here. */
export const ModemModule = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  width: "100%",
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.8)}`,
  backgroundColor: alpha(theme.palette.primary.main, 0.14),
  padding: theme.spacing(1, 1.5),
  fontSize: "0.6875rem",
  letterSpacing: "0.14em",
  color: theme.palette.primary.light,
  "& .MuiSvgIcon-root": { fontSize: "0.85rem" },
}));

export const ModemMeta = styled("span")(({ theme }) => ({
  marginLeft: "auto",
  fontSize: "0.6875rem",
  fontWeight: 400,
  letterSpacing: "0.1em",
  color: theme.palette.text.secondary,
}));

export const SatelliteNode = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.7)}`,
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  padding: theme.spacing(1, 2),
  fontSize: "0.6875rem",
  letterSpacing: "0.18em",
  color: theme.palette.primary.main,
  "& .MuiSvgIcon-root": { fontSize: "0.9rem" },
}));

export const EdgeLabel = styled("span", {
  shouldForwardProp: (prop) => prop !== "labelColor",
})<{ labelColor: string }>(({ theme, labelColor }) => ({
  marginBottom: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(labelColor, 0.7)}`,
  backgroundColor: alpha(labelColor, 0.12),
  padding: "1px 6px",
  fontSize: "0.6875rem",
  letterSpacing: "0.12em",
  color: labelColor,
}));

/** Legend for line colouring and status. */
export const Legend = styled("div")(({ theme }) => ({
  position: "absolute",
  left: theme.spacing(1),
  bottom: theme.spacing(1),
  display: "flex",
  gap: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: alpha(theme.palette.background.paper, 0.85),
  padding: theme.spacing(0.75, 1.5),
  fontSize: "0.6875rem",
  letterSpacing: "0.12em",
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
