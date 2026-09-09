import { alpha, styled } from "@mui/material/styles";
import type { LinkStatus } from "@/types/network";

export const MeterRoot = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  minWidth: 0,
  flex: 1,
}));

export const MeterBar = styled("div")({ flex: 1, minWidth: 32 });

/** Percentage badge tinted with the same status colour as the bar fill. */
export const MeterScore = styled("span", {
  shouldForwardProp: (prop) => prop !== "tone",
})<{ tone: LinkStatus }>(({ theme, tone }) => {
  const color = theme.palette.status[tone];
  return {
    fontSize: "0.75rem",
    fontWeight: 700,
    fontVariantNumeric: "tabular-nums",
    minWidth: 38,
    flexShrink: 0,
    textAlign: "center",
    padding: theme.spacing(0.25, 0.75),
    borderRadius: theme.shape.borderRadius,
    color,
    border: `1px solid ${alpha(color, 0.5)}`,
    backgroundColor: alpha(color, 0.14),
  };
});
