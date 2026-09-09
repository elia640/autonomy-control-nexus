import { styled } from "@mui/material/styles";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export const ModeToggleGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  display: "flex",
  width: "100%",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
}));

export const ModeToggleButton = styled(ToggleButton)(({ theme }) => ({
  flex: "1 1 0",
  minWidth: 0,
  whiteSpace: "nowrap",
  border: "none",
  borderRadius: 0,
  padding: theme.spacing(1.5, 3),

  fontSize: "0.625rem",
  fontWeight: 600,
  letterSpacing: "0.16em",
  color: theme.palette.text.secondary,
  "&:hover": { color: theme.palette.text.primary, backgroundColor: theme.palette.action.hover },
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": { backgroundColor: theme.palette.primary.dark },
  },
}));
