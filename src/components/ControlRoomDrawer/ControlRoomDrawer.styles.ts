import { styled } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";

export const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: 360,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.panel.header,
    borderLeft: `1px solid ${theme.palette.divider}`,
    backgroundImage: "none",
    gap: theme.spacing(1.5),
  },
}));

export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
  fontSize: "0.6875rem",
  fontWeight: 700,
  letterSpacing: "0.2em",
  color: theme.palette.primary.main,
}));

export const DrawerStack = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
  overflowY: "auto",
}));
