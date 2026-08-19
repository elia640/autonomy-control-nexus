import { alpha, styled } from "@mui/material/styles";

export const TopologyRoot = styled("div")(({ theme }) => ({
  position: "absolute",
  inset: 0,
  overflow: "auto",
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(12, 4, 6),
}));

export const TopologyColumnStack = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
});

export const SatelliteNode = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.7)}`,
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  padding: theme.spacing(1.5, 3),
  fontSize: "0.625rem",
  letterSpacing: "0.18em",
  color: theme.palette.primary.main,
  "& .MuiSvgIcon-root": { fontSize: "0.9rem" },
}));

/** Command post frame — deliberately heavier than the platform cards. */
export const CommandNode = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  border: `2px solid ${theme.palette.primary.main}`,
  outline: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
  outlineOffset: 3,
  boxShadow: `0 0 18px ${alpha(theme.palette.primary.main, 0.35)}`,
  backgroundColor: theme.palette.panel.header,
  padding: theme.spacing(3, 6),
  fontSize: "0.6875rem",
  fontWeight: 700,
  letterSpacing: "0.2em",
  color: theme.palette.primary.main,
  "& .MuiSvgIcon-root": { fontSize: "1rem" },
}));

export const Connector = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "lineColor" && prop !== "length" && prop !== "dashed" && prop !== "thick",
})<{
  lineColor?: string | undefined;
  length?: number | undefined;
  dashed?: boolean | undefined;
  thick?: boolean | undefined;
}>(({ theme, lineColor, length = 24, dashed, thick }) => {
  const color = lineColor ?? theme.palette.divider;
  return {
    height: length,
    width: thick ? 2 : 1,
    ...(dashed
      ? {
          backgroundColor: "transparent",
          backgroundImage: `repeating-linear-gradient(180deg, ${color} 0 4px, transparent 4px 8px)`,
        }
      : { backgroundColor: color }),
  };
});

export const HorizontalRule = styled("div")(({ theme }) => ({
  height: 1,
  width: "70%",
  backgroundColor: theme.palette.divider,
}));

export const SegmentGrid = styled("div")(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "flex-start",
  justifyContent: "center",
  gap: theme.spacing(6, 8),
  marginTop: theme.spacing(4),
}));

export const SegmentColumn = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

export const SegmentTitle = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.panel.header,
  padding: theme.spacing(1, 2),
  fontSize: "0.5625rem",
  fontWeight: 600,
  letterSpacing: "0.16em",
  color: theme.palette.primary.main,
  "& .MuiSvgIcon-root": { fontSize: "0.8rem" },
}));

export const SegmentMembers = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: theme.spacing(3),
}));

export const MemberColumn = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

export const MeshPanel = styled("div")(({ theme }) => ({
  width: "100%",
  maxWidth: 560,
  marginTop: theme.spacing(8),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: alpha(theme.palette.background.paper, 0.4),
  padding: theme.spacing(2),
}));

export const MeshPanelTitle = styled("div")(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
  fontSize: "0.5625rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.18em",
  color: theme.palette.text.secondary,
}));

export const MeshPanelRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(0.5, 0),
  fontSize: "0.5625rem",
  color: theme.palette.text.primary,
}));

export const MeshNodeLabel = styled("span", {
  shouldForwardProp: (prop) => prop !== "align",
})<{ align?: "left" | "right" }>(({ align = "left" }) => ({
  width: 70,
  textAlign: align,
}));

export const MeshLine = styled("span", {
  shouldForwardProp: (prop) =>
    prop !== "lineColor" && prop !== "dimmed" && prop !== "dashed",
})<{ lineColor: string; dimmed?: boolean; dashed?: boolean }>(
  ({ lineColor, dimmed, dashed }) => ({
    flex: 1,
    height: 2,
    ...(dashed
      ? {
          backgroundColor: "transparent",
          backgroundImage: `repeating-linear-gradient(90deg, ${lineColor} 0 5px, transparent 5px 10px)`,
        }
      : { backgroundColor: lineColor }),
    opacity: dimmed ? 0.4 : 1,
  }),
);

export const MeshStatusLabel = styled("span", {
  shouldForwardProp: (prop) => prop !== "statusColor",
})<{ statusColor: string }>(({ statusColor }) => ({
  width: 62,
  textAlign: "right",
  textTransform: "uppercase",
  color: statusColor,
}));

export const CommandRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
}));

export const CommandCaption = styled("span")(({ theme }) => ({
  fontSize: "0.5rem",
  fontWeight: 400,
  letterSpacing: "0.16em",
  color: theme.palette.text.secondary,
}));

/** Labelled link between a platform and the command post. */
export const LinkLabel = styled("span", {
  shouldForwardProp: (prop) => prop !== "labelColor",
})<{ labelColor: string }>(({ theme, labelColor }) => ({
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(labelColor, 0.7)}`,
  backgroundColor: alpha(labelColor, 0.12),
  padding: "0 4px",
  fontSize: "0.45rem",
  letterSpacing: "0.1em",
  color: labelColor,
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

export const NodeGrid = styled("div")(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "flex-start",
  justifyContent: "center",
  gap: theme.spacing(6, 6),
  marginTop: theme.spacing(14),
}));

export const EdgeLabel = styled("span", {
  shouldForwardProp: (prop) => prop !== "labelColor",
})<{ labelColor: string }>(({ theme, labelColor }) => ({
  marginBottom: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(labelColor, 0.7)}`,
  backgroundColor: alpha(labelColor, 0.12),
  padding: "1px 6px",
  fontSize: "0.45rem",
  letterSpacing: "0.12em",
  color: labelColor,
}));
