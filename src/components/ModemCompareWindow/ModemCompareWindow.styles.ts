import { alpha, styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";

export const WindowRoot = styled("div")(({ theme }) => ({
  position: "fixed",
  zIndex: 1300,
  width: 380,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.panel.surface,
  boxShadow: `0 12px 32px ${alpha("#000", 0.55)}`,
}));

export const WindowHeader = styled("header")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(1.5, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.panel.header,
  fontSize: "0.75rem",
  fontWeight: 700,
  letterSpacing: "0.16em",
  color: theme.palette.primary.main,
  cursor: "move",
  userSelect: "none",
}));

export const HeaderSpacer = styled("div")({ flex: 1 });

export const CloseButton = styled(IconButton)(({ theme }) => ({
  padding: 2,
  color: theme.palette.text.secondary,
  "& .MuiSvgIcon-root": { fontSize: "0.85rem" },
}));
