import { alpha, styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";

export const SettingsDialogRoot = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    width: "min(760px, 92vw)",
    maxWidth: "none",
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.45)}`,
    backgroundColor: theme.palette.background.paper,
    backgroundImage: "none",
    boxShadow: `0 0 40px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

export const DialogHeader = styled("header")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.panel.header,
  padding: theme.spacing(2.5, 3),
}));

export const DialogTitleText = styled("h2")(({ theme }) => ({
  margin: 0,
  flex: 1,
  fontSize: "0.8125rem",
  fontWeight: 700,
  letterSpacing: "0.24em",
  color: theme.palette.primary.main,
}));

export const SettingsTabs = styled(Tabs)(({ theme }) => ({
  minHeight: 0,
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: alpha(theme.palette.background.default, 0.6),
  "& .MuiTabs-indicator": { backgroundColor: theme.palette.primary.main },
}));

export const SettingsTab = styled(Tab)(({ theme }) => ({
  minHeight: 0,
  padding: theme.spacing(2, 3),
  fontSize: "0.6875rem",
  fontWeight: 600,
  letterSpacing: "0.18em",
  color: theme.palette.text.secondary,
  "&.Mui-selected": { color: theme.palette.primary.main },
  "& .MuiSvgIcon-root": { fontSize: "0.95rem" },
}));

export const TabBody = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: theme.spacing(3),
  padding: theme.spacing(4),
  minHeight: 320,
  alignContent: "start",
}));

export const FieldGroup = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: alpha(theme.palette.background.default, 0.5),
  padding: theme.spacing(2.5),
}));

export const FieldLabel = styled("span")(({ theme }) => ({
  fontSize: "0.6875rem",
  fontWeight: 600,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: theme.palette.text.secondary,
}));

export const FieldHint = styled("span")(({ theme }) => ({
  fontSize: "0.6875rem",
  color: theme.palette.text.secondary,
}));

export const SettingsField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    fontSize: "0.6875rem",
    color: theme.palette.text.primary,
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
  },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: theme.palette.divider },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
  },
}));

export const DialogFooterRow = styled("footer")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.panel.header,
  padding: theme.spacing(2.5, 3),
}));
