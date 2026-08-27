import { alpha, styled } from "@mui/material/styles";
import type { LinkStatus } from "@/types/network";

export const PanelRoot = styled("div")(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
}));

export const HeaderRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(2, 2.5),
}));

export const PanelName = styled("span")(({ theme }) => ({
  fontSize: "0.6875rem",
  fontWeight: 700,
  letterSpacing: "0.1em",
  color: theme.palette.text.primary,
  whiteSpace: "nowrap",
}));

export const DetailRow = styled("div")(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(1, 4),
  borderTop: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(1.5, 2.5),
  fontSize: "0.5625rem",
  letterSpacing: "0.08em",
  color: theme.palette.text.secondary,
}));

export const DetailItem = styled("span")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

export const ValueText = styled("span", {
  shouldForwardProp: (prop) => prop !== "tone",
})<{ tone: LinkStatus }>(({ theme, tone }) => ({
  fontWeight: 700,
  fontVariantNumeric: "tabular-nums",
  color:
    tone === "good"
      ? theme.palette.text.primary
      : tone === "marginal"
        ? theme.palette.status.marginal
        : theme.palette.status.poor,
}));
