import { alpha, styled } from "@mui/material/styles";

export const TopologyRoot = styled("div")(({ theme }) => ({
  position: "absolute",
  inset: 0,
  overflow: "auto",
  display: "flex",
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(0.5),
}));

/** Positioning context for the measured connection layer. */
export const TopologyContent = styled("div")({
  position: "relative",
  display: "flex",
  alignItems: "stretch",
  justifyContent: "center",
  flex: "1 0 auto",
  width: "100%",
});

export const EdgeSvg = styled("svg")({
  position: "absolute",
  left: 0,
  top: 0,
  /** Above the control room panel so lines reach the router inside it. */
  zIndex: 1,
  pointerEvents: "none",
  overflow: "visible",
});

/** Three stacked rows: control room, relay layer, platforms. */
export const LayerStack = styled("div")(({ theme }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(3),
  flex: "1 1 auto",
  /** Fills the central canvas edge to edge. */
  width: "100%",
  minWidth: 720,
  maxWidth: 1680,
  height: "100%",
  minHeight: 460,
  margin: "0 auto",
  /** Bottom padding keeps the platform row clear of the legend. */
  padding: theme.spacing(2, 2, 10),
}));

export const LayerRow = styled("div")(({ theme }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-end",
  justifyContent: "center",
  gap: theme.spacing(1.5),
  width: "100%",
}));

/** Bottom row of platforms; all units stay on a single spaced row. */
export const PlatformRow = styled(LayerRow)(({ theme }) => ({
  flexWrap: "nowrap",
  justifyContent: "space-evenly",
  alignItems: "flex-end",
  width: "100%",
  columnGap: theme.spacing(1.5),
}));


export const LayerCaption = styled("div")(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(-4),
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
  position: "relative",
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "flex-end",
  opacity: dimmed ? 0.3 : 1,
  transition: "opacity 160ms ease",
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
  textAlign: "center",
  color: labelColor,
}));

/** Intermediate hop (relay unit / vehicle acting as a relay). */
export const HopNode = styled("div", {
  shouldForwardProp: (prop) => prop !== "accent" && prop !== "dimmed",
})<{ accent: string; dimmed?: boolean }>(({ theme, accent, dimmed }) => ({
  position: "relative",
  zIndex: 2,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(3),
  width: "50%",
  minWidth: 420,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(accent, 0.8)}`,
  backgroundColor: alpha(accent, 0.1),
  boxShadow: `0 0 14px ${alpha(accent, 0.18)}`,
  padding: theme.spacing(2.5, 4),
  fontSize: "0.875rem",
  fontWeight: 700,
  letterSpacing: "0.14em",
  whiteSpace: "nowrap",
  color: accent,
  opacity: dimmed ? 0.3 : 1,
  transition: "opacity 160ms ease",
  "& .MuiSvgIcon-root": { fontSize: "1.125rem" },
}));

export const HopRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  whiteSpace: "nowrap",
  gap: theme.spacing(1),
}));

export const HopCaption = styled("span")(({ theme }) => ({
  fontSize: "0.75rem",
  fontWeight: 400,
  letterSpacing: "0.1em",
  color: theme.palette.text.secondary,
}));

/** Control room frame — the widest element, sitting at the top of the canvas. */
export const CommandNode = styled("div")(({ theme }) => ({
  position: "relative",
  zIndex: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(2),
  width: "80%",
  minWidth: 600,
  borderRadius: theme.shape.borderRadius,
  border: `2px solid ${theme.palette.primary.main}`,
  outline: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
  outlineOffset: 3,
  boxShadow: `0 0 18px ${alpha(theme.palette.primary.main, 0.35)}`,
  /** Transparent so platform lines stay visible up to the router inside. */
  backgroundColor: "transparent",
  padding: theme.spacing(2.5, 4),
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: 700,
  letterSpacing: "0.18em",
  whiteSpace: "nowrap",
  color: theme.palette.primary.main,
  "& .MuiSvgIcon-root": { fontSize: "1.25rem" },
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

/** Router unit inside the control room; every platform line terminates here.
 *  Kept narrow so further routers can sit alongside it later. */
export const RouterModule = styled("div")(({ theme }) => ({
  position: "relative",
  zIndex: 2,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(1),
  width: "auto",
  minWidth: 260,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.9)}`,
  backgroundColor: alpha(theme.palette.primary.main, 0.18),
  padding: theme.spacing(1, 2),
  /** Free-standing rectangle, detached from the control room edge. */
  marginBottom: theme.spacing(2),
  fontSize: "0.8125rem",
  fontWeight: 700,
  letterSpacing: "0.12em",
  whiteSpace: "nowrap",
  color: theme.palette.primary.light,
  "& .MuiSvgIcon-root": { fontSize: "1rem" },
}));

export const ModemMeta = styled("span")(({ theme }) => ({
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
  padding: theme.spacing(0.75, 2),
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
