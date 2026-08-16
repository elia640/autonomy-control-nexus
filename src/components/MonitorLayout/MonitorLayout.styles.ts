import { styled } from "@mui/material/styles";

export const LayoutRoot = styled("main")(({ theme }) => ({
  display: "flex",
  height: "100vh",
  width: "100%",
  overflow: "hidden",
  backgroundColor: theme.palette.background.default,
}));
