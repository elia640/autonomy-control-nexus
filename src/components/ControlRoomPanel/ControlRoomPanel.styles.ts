import { alpha, styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export const PanelHeader = styled("header")(({ theme }) => ({
  backgroundColor: theme.palette.panel.header,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const PanelTitle = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: "center",
  fontSize: "0.9375rem",
  fontWeight: 700,
  letterSpacing: "0.24em",
  color: theme.palette.primary.main,
})) as typeof Typography;

export const PrecheckBar = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2, 3),
  borderTop: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
}));

export const PrecheckLabel = styled("p")(({ theme }) => ({
  margin: 0,
  fontSize: "0.6875rem",
  fontWeight: 600,
  letterSpacing: "0.24em",
  color: theme.palette.text.primary,
}));

export const RunButton = styled(Button)(({ theme }) => ({
  minWidth: 0,
  padding: theme.spacing(1, 2.5),
  fontSize: "0.625rem",
  fontWeight: 700,
  "& .MuiSvgIcon-root": { fontSize: "0.75rem" },
}));

export const SectionBody = styled("div")(({ theme }) => ({
  padding: theme.spacing(2.5, 3),
}));

export const AssetStack = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  padding: theme.spacing(2.5, 3),
}));

export const HealthCaption = styled("p")(({ theme }) => ({
  margin: theme.spacing(0, 0, 1.5),
  fontSize: "0.625rem",
  color: theme.palette.text.secondary,
}));

export const HealthScale = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  marginTop: theme.spacing(1),
  fontSize: "0.5625rem",
  color: theme.palette.text.secondary,
}));

export const PanelFooter = styled("footer")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(2.5, 3),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.panel.header,
}));

export const SettingsButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 2.5),
  fontSize: "0.625rem",
  fontWeight: 600,
  color: theme.palette.text.secondary,
  borderColor: theme.palette.divider,
  "&:hover": {
    color: theme.palette.text.primary,
    borderColor: alpha(theme.palette.primary.main, 0.5),
  },
  "& .MuiSvgIcon-root": { fontSize: "0.9rem" },
}));

export const PanelStack = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2.5),
  padding: theme.spacing(2.5, 3),
}));

export const CompareRow = styled("div")(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(1, 3),
  padding: theme.spacing(2, 3, 0),
}));

export const CompareCaption = styled("p")(({ theme }) => ({
  margin: theme.spacing(0, 0, 1),
  padding: theme.spacing(2, 3, 0),
  fontSize: "0.5625rem",
  letterSpacing: "0.12em",
  color: theme.palette.text.secondary,
}));

export const FooterSpacer = styled("div")({ flex: 1 });

export const ControlRoomButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active: boolean }>(({ theme, active }) => ({
  padding: theme.spacing(1.5, 2.5),
  fontSize: "0.625rem",
  fontWeight: 700,
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  borderColor: active ? theme.palette.primary.main : theme.palette.divider,
  backgroundColor: active ? alpha(theme.palette.primary.main, 0.14) : "transparent",
  "&:hover": {
    color: theme.palette.primary.main,
    borderColor: alpha(theme.palette.primary.main, 0.6),
  },
  "& .MuiSvgIcon-root": { fontSize: "0.9rem" },
}));
