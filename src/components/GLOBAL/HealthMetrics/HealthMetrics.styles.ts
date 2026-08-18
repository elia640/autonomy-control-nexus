import { alpha, styled } from "@mui/material/styles";
import type { LinkStatus } from "@/types/network";

export const MetricsRow = styled("div", {
  shouldForwardProp: (prop) => prop !== "dense",
})<{ dense?: boolean }>(({ theme, dense }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: theme.spacing(dense ? 1 : 2),
  fontSize: dense ? "0.45rem" : "0.5625rem",
  color: theme.palette.text.secondary,
}));

export const MetricChip = styled("span", {
  shouldForwardProp: (prop) => prop !== "tone",
})<{ tone: LinkStatus }>(({ theme, tone }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${
    tone === "good" ? theme.palette.divider : alpha(theme.palette.status[tone], 0.8)
  }`,
  backgroundColor: tone === "good" ? "transparent" : alpha(theme.palette.status[tone], 0.15),
  padding: "0 3px",
  letterSpacing: "0.04em",
  whiteSpace: "nowrap",
  color: tone === "good" ? theme.palette.text.secondary : theme.palette.status[tone],
  "& .MuiSvgIcon-root": { fontSize: "0.65rem" },
}));
