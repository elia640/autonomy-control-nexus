import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

export const SectionHeaderBar = styled("div")(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(1.75, 3),
  backgroundColor: theme.palette.panel.header,
  borderTop: `1px solid ${theme.palette.divider}`,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const SectionHeaderTitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "emphasis",
})<{ emphasis?: boolean }>(({ theme, emphasis }) => ({
  fontSize: emphasis ? "0.875rem" : "0.75rem",
  fontWeight: 800,
  letterSpacing: emphasis ? "0.24em" : "0.2em",
  textAlign: "center",
  textTransform: "uppercase",
  color: emphasis ? theme.palette.primary.light : theme.palette.text.primary,
})) as ReturnType<typeof styled>;

export const SectionHeaderAction = styled("div")(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(3),
  top: "50%",
  transform: "translateY(-50%)",
  display: "flex",
  alignItems: "center",
}));
