import { alpha, styled } from "@mui/material/styles";

export const MapRoot = styled("div")({
  position: "absolute",
  inset: 0,
  overflow: "hidden",
});

export const MapImage = styled("img")({
  height: "100%",
  width: "100%",
  objectFit: "cover",
});

export const OverlayLayer = styled("div")({
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
});

export const OverlaySvg = styled("svg")({
  position: "absolute",
  inset: 0,
  height: "100%",
  width: "100%",
});

export const AnchoredPoint = styled("div")({
  position: "absolute",
  transform: "translate(-50%, -50%)",
});

export const MeshChip = styled("div", {
  shouldForwardProp: (prop) => prop !== "chipColor",
})<{ chipColor: string }>(({ theme, chipColor }) => ({
  position: "absolute",
  transform: "translate(-50%, -50%)",
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${chipColor}`,
  color: chipColor,
  backgroundColor: alpha(theme.palette.background.default, 0.85),
  padding: theme.spacing(0.25, 1),
  fontSize: "0.5rem",
  letterSpacing: "0.12em",
  backdropFilter: "blur(4px)",
}));

export const NodeBadge = styled("div", {
  shouldForwardProp: (prop) => prop !== "shape" && prop !== "borderColor",
})<{ shape: "circle" | "square"; borderColor: string }>(({ theme, shape, borderColor }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: shape === "circle" ? 36 : 30,
  width: shape === "circle" ? 36 : 30,
  borderRadius: shape === "circle" ? "50%" : theme.shape.borderRadius,
  border: `1px solid ${borderColor}`,
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  "& .MuiSvgIcon-root": { fontSize: "1rem", color: borderColor },
}));

export const PingRing = styled("span")(({ theme }) => ({
  position: "absolute",
  inset: 0,
  borderRadius: "50%",
  border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
  animation: "tacticalPing 1.8s cubic-bezier(0, 0, 0.2, 1) infinite",
  "@keyframes tacticalPing": {
    "75%, 100%": { transform: "scale(1.8)", opacity: 0 },
  },
}));

export const NodeLabel = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(1),
  whiteSpace: "nowrap",
  textAlign: "center",
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: alpha(theme.palette.background.default, 0.8),
  padding: theme.spacing(0.5, 1.5),
  fontSize: "0.5625rem",
  letterSpacing: "0.14em",
  color: theme.palette.primary.main,
}));

export const MarkerColumn = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

export const InfoChip = styled("div")(({ theme }) => ({
  position: "absolute",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: alpha(theme.palette.background.default, 0.7),
  padding: theme.spacing(1, 1.5),
  fontSize: "0.5625rem",
  letterSpacing: "0.16em",
  color: theme.palette.text.secondary,
  "& .MuiSvgIcon-root": { fontSize: "0.8rem", color: theme.palette.primary.main },
}));

export const LegendBox = styled("div")(({ theme }) => ({
  position: "absolute",
  left: theme.spacing(3),
  bottom: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: alpha(theme.palette.background.default, 0.8),
  padding: theme.spacing(1.5, 2),
  fontSize: "0.5625rem",
  color: theme.palette.text.secondary,
}));

export const LegendRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  textTransform: "uppercase",
  letterSpacing: "0.12em",
}));

export const LegendSwatch = styled("span", {
  shouldForwardProp: (prop) => prop !== "swatchColor" && prop !== "dashed",
})<{ swatchColor: string; dashed?: boolean }>(({ swatchColor, dashed }) => ({
  height: dashed ? 0 : 2,
  width: 16,
  backgroundColor: dashed ? "transparent" : swatchColor,
  borderTop: dashed ? `1px dashed ${swatchColor}` : "none",
}));

export const ScaleBox = styled("div")(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(3),
  bottom: theme.spacing(3),
  textAlign: "right",
  fontSize: "0.5625rem",
  letterSpacing: "0.14em",
  color: theme.palette.text.secondary,
}));

export const ScaleBar = styled("div")(({ theme }) => ({
  marginLeft: "auto",
  height: 4,
  width: 80,
  borderLeft: `1px solid ${theme.palette.divider}`,
  borderRight: `1px solid ${theme.palette.divider}`,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const DraggableNode = styled("div", {
  shouldForwardProp: (prop) => prop !== "dragging",
})<{ dragging: boolean }>(({ dragging }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  pointerEvents: "auto",
  cursor: dragging ? "grabbing" : "grab",
  touchAction: "none",
}));

/** Badges shown when a platform transmits on several ranges at once. */
export const DualLinkRow = styled("div")(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(0.5),
}));

export const DualLinkChip = styled("span", {
  shouldForwardProp: (prop) => prop !== "chipColor",
})<{ chipColor: string }>(({ theme, chipColor }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 2,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${chipColor}`,
  backgroundColor: alpha(theme.palette.background.default, 0.85),
  padding: "0 3px",
  fontSize: "0.45rem",
  letterSpacing: "0.08em",
  color: chipColor,
  "& .MuiSvgIcon-root": { fontSize: "0.6rem" },
}));
