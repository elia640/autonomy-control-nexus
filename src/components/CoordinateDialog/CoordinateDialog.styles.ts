import { styled } from "@mui/material/styles";

export const FieldRow = styled("div")(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  marginTop: theme.spacing(1),
}));

export const Hint = styled("p")(({ theme }) => ({
  margin: 0,
  fontSize: "0.75rem",
  color: theme.palette.text.secondary,
}));
