import { alpha, styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import type { NotificationSeverity } from "@/data/notifications";

export const TrayButton = styled(IconButton)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.background.paper, 0.85),
  color: theme.palette.text.primary,
  padding: theme.spacing(1),
  "&:hover": { backgroundColor: alpha(theme.palette.background.paper, 0.95) },
  "& .MuiSvgIcon-root": { fontSize: "1.1rem" },
}));

export const TrayList = styled("div")(({ theme }) => ({
  width: 300,
  padding: theme.spacing(1),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

export const TrayItem = styled("div", {
  shouldForwardProp: (prop) => prop !== "severity",
})<{ severity: NotificationSeverity }>(({ theme, severity }) => ({
  borderLeft: `3px solid ${theme.palette.status[severity]}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.background.default, 0.6),
  padding: theme.spacing(1, 1.5),
}));

export const ItemTitle = styled("div")(({ theme }) => ({
  fontSize: "0.75rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  color: theme.palette.text.primary,
}));

export const ItemDetail = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  gap: theme.spacing(1),
  fontSize: "0.75rem",
  color: theme.palette.text.secondary,
}));
