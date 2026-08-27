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
  gridTemplateColumns: "20px 20px minmax(0, 1fr) 104px auto",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(2, 2.5),
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

export const PanelName = styled("span")(({ theme }) => ({
  fontSize: "0.6875rem",
  fontWeight: 700,
  letterSpacing: "0.1em",
  color: theme.palette.text.primary,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

export const MetaRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexWrap: "nowrap",
  gap: theme.spacing(1, 1.5),
  padding: theme.spacing(0, 2.5, 2),
  paddingLeft: theme.spacing(8),
  fontSize: "0.5625rem",
  letterSpacing: "0.08em",
  color: theme.palette.text.secondary,
}));

export const MetaSpacer = styled("span")({ flex: 1 });

export const MetaItem = styled("span")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(1),
  whiteSpace: "nowrap",
  flexShrink: 0,
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

export const ResetButton = styled(Button)(({ theme }) => ({
  minWidth: 0,
  padding: theme.spacing(0.75, 2),
  fontSize: "0.5625rem",
  fontWeight: 800,
  letterSpacing: "0.12em",
  borderWidth: 1,
  color: theme.palette.status.marginal,
  borderColor: alpha(theme.palette.status.marginal, 0.7),
  backgroundColor: alpha(theme.palette.status.marginal, 0.1),
  "&:hover": {
    borderColor: theme.palette.status.marginal,
    backgroundColor: alpha(theme.palette.status.marginal, 0.22),
  },
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
