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
  gridTemplateColumns: "20px 20px minmax(0, 1fr)",
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
  fontSize: "0.6875rem",
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

/** Reboot sits under the channel list, visible only when the panel is open. */
export const RebootRow = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 2.5, 2),
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
  gridTemplateColumns: "auto 76px 74px 1fr 54px",
  alignItems: "center",
  gap: theme.spacing(1.5),
  fontSize: "0.6875rem",
  color: theme.palette.text.secondary,
}));

export const ChannelGroup = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

/** Clickable channel name that reveals the RF readouts underneath. */
export const ChannelNameButton = styled("button")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr auto",
  alignItems: "center",
  width: "100%",
  gap: theme.spacing(0.5),
  border: "none",
  padding: 0,
  background: "none",
  cursor: "pointer",
  textAlign: "left",
  font: "inherit",
  fontWeight: 700,
  letterSpacing: "0.06em",
  color: theme.palette.text.primary,
  "& .MuiSvgIcon-root": {
    fontSize: "1.05rem",
    color: theme.palette.primary.main,
    borderRadius: "50%",
    border: `1px solid ${alpha(theme.palette.primary.main, 0.6)}`,
    backgroundColor: alpha(theme.palette.primary.main, 0.14),
    transition: theme.transitions.create(["background-color", "border-color"]),
  },
  "&:hover .MuiSvgIcon-root": {
    backgroundColor: alpha(theme.palette.primary.main, 0.28),
    borderColor: theme.palette.primary.main,
  },
}));

/** SINR / RSSI / RSRP readouts revealed under a satellite channel. */
export const MetricsRow = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: theme.spacing(1),
  marginLeft: theme.spacing(6),
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
  backgroundColor: alpha(theme.palette.background.default, 0.5),
}));

export const MetricCell = styled("span")({
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
});

export const MetricName = styled("span")(({ theme }) => ({
  fontSize: "0.5625rem",
  letterSpacing: "0.06em",
  color: theme.palette.text.secondary,
}));

export const MetricValue = styled("span")(({ theme }) => ({
  fontSize: "0.6875rem",
  fontWeight: 700,
  fontVariantNumeric: "tabular-nums",
  color: theme.palette.text.primary,
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
