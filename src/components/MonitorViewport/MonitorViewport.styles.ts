import { alpha, styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

export const ViewportRoot = styled("div")({
  position: "relative",
  flex: 1,
  minWidth: 0,
  height: "100%",
});

export const ViewportTitle = styled("div")(({ theme }) => ({
  position: "absolute",
  left: "50%",
  top: theme.spacing(3),
  transform: "translateX(-50%)",
  fontSize: "0.8125rem",
  fontWeight: 700,
  letterSpacing: "0.2em",
  color: theme.palette.text.primary,
  pointerEvents: "none",
}));

/** Top-right control bar: links toggle with the notification tray beside it. */
export const TopRightBar = styled("div")(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(3),
  top: theme.spacing(3),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  zIndex: 5,
}));

export const TraySlot = styled("div")({
  display: "flex",
  alignItems: "center",
});

export const LinksButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active: boolean }>(({ theme, active }) => ({
  padding: theme.spacing(1, 2),
  fontSize: "0.75rem",
  border: `1px solid ${active ? theme.palette.primary.main : theme.palette.divider}`,
  backgroundColor: active
    ? theme.palette.primary.main
    : alpha(theme.palette.background.paper, 0.8),
  color: active ? theme.palette.primary.contrastText : theme.palette.text.secondary,
  "&:hover": {
    backgroundColor: active
      ? theme.palette.primary.dark
      : alpha(theme.palette.background.paper, 0.95),
  },
  "& .MuiSvgIcon-root": { fontSize: "0.85rem" },
}));
