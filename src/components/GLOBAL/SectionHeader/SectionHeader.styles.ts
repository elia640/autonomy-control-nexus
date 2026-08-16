import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

export const SectionHeaderBar = styled("div")(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  backgroundColor: theme.palette.panel.header,
  borderTop: `1px solid ${theme.palette.divider}`,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const SectionHeaderTitle = styled(Typography)(({ theme }) => ({
  fontSize: "0.68rem",
  fontWeight: 600,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: theme.palette.text.primary,
})) as typeof Typography;
