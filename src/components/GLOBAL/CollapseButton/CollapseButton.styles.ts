import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";

export const CollapseIconButton = styled(IconButton)(({ theme }) => ({
  padding: 0,
  color: theme.palette.text.secondary,
  "&:hover": { color: theme.palette.text.primary, backgroundColor: "transparent" },
  "& .MuiSvgIcon-root": { fontSize: "0.95rem" },
}));
