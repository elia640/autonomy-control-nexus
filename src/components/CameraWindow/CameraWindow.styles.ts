import { alpha, styled } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";
import IconButton from "@mui/material/IconButton";

export const Backdrop = styled("div")(({ theme }) => ({
  position: "fixed",
  inset: 0,
  zIndex: theme.zIndex.modal,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: alpha(theme.palette.common.black, 0.6),
  backdropFilter: "blur(2px)",
}));

export const WindowFrame = styled("div")(({ theme }) => ({
  position: "relative",
  width: "min(90vw, 680px)",
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.6)}`,
  backgroundColor: theme.palette.panel.surface,
  boxShadow: `0 0 24px ${alpha(theme.palette.common.black, 0.7)}`,
  overflow: "hidden",
}));

export const WindowHeader = styled("header")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(1.5, 2),
  backgroundColor: theme.palette.panel.header,
  borderBottom: `1px solid ${theme.palette.divider}`,
  fontSize: "0.75rem",
  letterSpacing: "0.16em",
  color: theme.palette.primary.main,
}));

export const HeaderSpacer = styled("span")({ flex: 1 });

export const QualityButton = styled(ButtonBase)(({ theme }) => ({
  height: 22,
  minWidth: 22,
  padding: theme.spacing(0, 1),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.7)}`,
  backgroundColor: alpha(theme.palette.primary.main, 0.15),
  color: theme.palette.primary.main,
  fontSize: "0.75rem",
  letterSpacing: "0.12em",
}));

export const CloseButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.5),
  color: theme.palette.text.secondary,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  "&:hover": { color: theme.palette.text.primary },
  "& .MuiSvgIcon-root": { fontSize: "0.9rem" },
}));

export const FeedImage = styled("img")({
  display: "block",
  width: "100%",
  height: "auto",
});

export const FeedFooter = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(1.5, 2),
  borderTop: `1px solid ${theme.palette.divider}`,
  fontSize: "0.75rem",
  letterSpacing: "0.12em",
  color: theme.palette.text.secondary,
}));
