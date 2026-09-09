import { alpha, styled } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";

export const WheelRoot = styled("section", {
  shouldForwardProp: (prop) => prop !== "expanded" && prop !== "dragging",
})<{ expanded: boolean; dragging: boolean }>(({ theme, expanded, dragging }) => ({
  position: "fixed",
  width: expanded ? 420 : 190,
  boxShadow: dragging ? theme.shadows[8] : "none",
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: alpha(theme.palette.background.default, 0.92),
  backdropFilter: "blur(4px)",
  pointerEvents: "auto",
  transition: theme.transitions.create("width"),
  userSelect: "none",
  zIndex: 3,
}));

export const WheelHeader = styled("header")(({ theme }) => ({
  cursor: "move",
  touchAction: "none",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(1, 1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.panel.header,
  fontSize: "0.75rem",
  letterSpacing: "0.14em",
  color: theme.palette.primary.main,
}));

export const WheelSpacer = styled("span")({ flex: 1 });

export const WheelToggle = styled(ButtonBase)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  padding: 2,
  color: theme.palette.text.secondary,
  "&:hover": { color: theme.palette.text.primary },
  "& .MuiSvgIcon-root": { fontSize: "0.8rem" },
}));

export const WheelBody = styled("div")(({ theme }) => ({
  padding: theme.spacing(1.5),
}));

export const WheelSvg = styled("svg")({ width: "100%", display: "block" });

export const WheelLegend = styled("div")(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(2),
  marginTop: theme.spacing(1),
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: theme.palette.text.secondary,
}));

export const LegendDot = styled("span", {
  shouldForwardProp: (prop) => prop !== "dotColor",
})<{ dotColor: string }>(({ dotColor }) => ({
  display: "inline-block",
  height: 6,
  width: 6,
  borderRadius: "50%",
  marginRight: 4,
  backgroundColor: dotColor,
}));
