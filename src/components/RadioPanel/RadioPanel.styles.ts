import { alpha, styled } from "@mui/material/styles";
import type { LinkStatus } from "@/types/network";

export const PanelRoot = styled("div")(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
}));

/** Mirrors the modem panel header grid so both panels line up. */
export const HeaderRow = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "22px 22px 112px 1fr auto",
  alignItems: "center",
  gap: theme.spacing(1.5),
  padding: theme.spacing(2, 2.5),
}));

export const AssetIcon = styled("span")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.secondary.main,
  "& .MuiSvgIcon-root": { fontSize: "1rem" },
}));

export const PanelName = styled("span")(({ theme }) => ({
  fontSize: "0.6875rem",
  fontWeight: 700,
  letterSpacing: "0.1em",
  color: theme.palette.text.primary,
  whiteSpace: "nowrap",
}));

export const MetaRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: theme.spacing(1, 2.5),
  padding: theme.spacing(0, 2.5, 2),
  paddingLeft: theme.spacing(8),
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
