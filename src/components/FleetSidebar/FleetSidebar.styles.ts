import { alpha, styled } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

export const SidebarHeader = styled("header")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  backgroundColor: theme.palette.panel.header,
  borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
}));

export const SidebarTitle = styled(Typography)(({ theme }) => ({
  flex: 1,
  fontSize: "0.8125rem",
  fontWeight: 700,
  letterSpacing: "0.2em",
  color: theme.palette.primary.main,
})) as typeof Typography;

export const CollapseIconButton = styled(IconButton)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  "&:hover": {
    color: theme.palette.text.primary,
    borderColor: alpha(theme.palette.primary.main, 0.6),
  },
  "& .MuiSvgIcon-root": { fontSize: "0.9rem" },
}));

export const CollapsedRail = styled(ButtonBase)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(2),
  width: 32,
  flexShrink: 0,
  height: "100%",
  paddingTop: theme.spacing(3),
  backgroundColor: theme.palette.panel.surface,
  borderRight: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.secondary,
  "&:hover": { color: theme.palette.text.primary },
}));

export const RailLabel = styled("span")(({ theme }) => ({
  writingMode: "vertical-rl",
  fontSize: "0.5625rem",
  letterSpacing: "0.2em",
  color: theme.palette.primary.main,
}));

export const ListBody = styled("div")(({ theme }) => ({
  padding: theme.spacing(2, 3),
  fontSize: "0.625rem",
}));

export const ListHeadRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  fontSize: "0.5625rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: theme.palette.text.secondary,
}));

export const ListRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(1, 0),
}));

export const NameCell = styled("span")(({ theme }) => ({
  width: 62,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  color: theme.palette.text.primary,
}));

export const KindCell = styled("span")(({ theme }) => ({
  width: 52,
  color: theme.palette.text.secondary,
}));

export const GrowCell = styled("span")({ flex: 1, minWidth: 0 });

export const RateCell = styled("span", {
  shouldForwardProp: (prop) => prop !== "width",
})<{ width?: number }>(({ theme, width = 44 }) => ({
  width,
  textAlign: "right",
  color: theme.palette.text.secondary,
}));

export const SatelliteName = styled("span", {
  shouldForwardProp: (prop) => prop !== "status",
})<{ status: "good" | "marginal" | "poor" }>(({ theme, status }) => ({
  flex: 1,
  color: theme.palette.status[status],
}));
