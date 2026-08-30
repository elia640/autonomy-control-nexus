import { alpha, styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import type { ChannelState, LinkStatus } from "@/types/network";

export const PanelRoot = styled("div")(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
}));

export const HeaderRow = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "20px 20px minmax(0, 1fr) auto",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(2, 2.5, 1),
  "& > *": { minWidth: 0 },
}));

/** Distinguishes the asset kind at a glance (cellular modem vs radio). */
export const AssetIcon = styled("span")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.primary.main,
  "& .MuiSvgIcon-root": { fontSize: "1rem" },
}));

/** Asset name with its health chips directly underneath. */
export const NameBlock = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  minWidth: 0,
}));

export const PanelName = styled("span")(({ theme }) => ({
  fontSize: "0.6875rem",
  fontWeight: 700,
  letterSpacing: "0.1em",
  color: theme.palette.text.primary,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

/** Quality bar, score and throughput share one row. */
export const MeterRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(0, 2.5, 2),
  paddingLeft: theme.spacing(8),
}));

export const RateText = styled("span")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(1),
  flexShrink: 0,
  whiteSpace: "nowrap",
  fontSize: "0.5625rem",
  letterSpacing: "0.08em",
  color: theme.palette.text.secondary,
}));

/** Numeric readout: white when normal, orange on warning, red when critical. */
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

/** Matches the outlined footer controls (Settings / Control Room). */
export const ResetButton = styled(Button)(({ theme }) => ({
  marginLeft: "auto",
  minWidth: 0,
  padding: theme.spacing(1, 2),
  fontSize: "0.625rem",
  fontWeight: 600,
  letterSpacing: "0.16em",
  color: theme.palette.text.secondary,
  borderColor: theme.palette.divider,
  "&:hover": {
    color: theme.palette.primary.main,
    borderColor: alpha(theme.palette.primary.main, 0.6),
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
  "& .MuiSvgIcon-root": { fontSize: "0.8rem" },
}));

export const ChannelList = styled("div")(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(1.5, 2.5, 2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

export const ChannelRow = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "48px 78px 1fr 46px auto",
  alignItems: "center",
  gap: theme.spacing(1.5),
  fontSize: "0.5625rem",
  color: theme.palette.text.secondary,
}));

export const ChannelName = styled("span")(({ theme }) => ({
  fontWeight: 700,
  letterSpacing: "0.06em",
  color: theme.palette.text.primary,
}));

const STATE_COLOR: Record<ChannelState, "good" | "poor" | "muted"> = {
  connected: "good",
  disconnected: "poor",
  absent: "muted",
  unplugged: "muted",
};

export const StateChip = styled("span", {
  shouldForwardProp: (prop) => prop !== "state",
})<{ state: ChannelState }>(({ theme, state }) => {
  const kind = STATE_COLOR[state];
  const color = kind === "muted" ? theme.palette.text.secondary : theme.palette.status[kind];
  return {
    display: "inline-flex",
    justifyContent: "center",
    padding: theme.spacing(0.5, 1),
    fontSize: "0.5rem",
    fontWeight: 700,
    letterSpacing: "0.06em",
    color,
    border: `1px solid ${alpha(color, 0.5)}`,
    borderRadius: theme.shape.borderRadius,
    whiteSpace: "nowrap",
  };
});

export const RateCell = styled("span")({
  textAlign: "right",
  fontVariantNumeric: "tabular-nums",
});

/** Health chips sit under the quality bar, aligned with it. */
export const HealthRow = styled("div")(({ theme }) => ({
  display: "flex",
  padding: theme.spacing(0, 2.5, 2),
  paddingLeft: theme.spacing(8),
}));
