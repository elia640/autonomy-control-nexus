import { styled } from "@mui/material/styles";
import type { LinkStatus } from "@/types/network";

export const MeterRoot = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  minWidth: 0,
  flex: 1,
}));

export const MeterBar = styled("div")({ flex: 1, minWidth: 32 });

export const MeterScore = styled("span", {
  shouldForwardProp: (prop) => prop !== "tone",
})<{ tone: LinkStatus }>(({ theme, tone }) => ({
  fontSize: "0.625rem",
  fontWeight: 700,
  fontVariantNumeric: "tabular-nums",
  minWidth: 20,
  textAlign: "right",
  color: theme.palette.status[tone],
}));
