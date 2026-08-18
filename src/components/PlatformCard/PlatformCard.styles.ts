import ButtonBase from "@mui/material/ButtonBase";
import { alpha, styled } from "@mui/material/styles";
import type { LinkStatus } from "@/types/network";

export type PlatformCardVariant = "overlay" | "topology";

export const CardRoot = styled("div", {
  shouldForwardProp: (prop) => prop !== "variant" && prop !== "status",
})<{ variant: PlatformCardVariant; status: LinkStatus }>(({ theme, variant, status }) => ({
  width: variant === "overlay" ? 214 : 224,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${
    variant === "overlay" ? theme.palette.divider : theme.palette.status[status]
  }`,
  backgroundColor:
    variant === "overlay"
      ? alpha(theme.palette.background.default, 0.92)
      : alpha(theme.palette.background.paper, 0.6),
  backdropFilter: variant === "overlay" ? "blur(4px)" : "none",
  fontSize: "0.5625rem",
  lineHeight: 1.35,
  pointerEvents: "auto",
  marginTop: variant === "overlay" ? theme.spacing(1) : 0,
}));

export const CardHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1, 1.5),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
}));

export const CardTitle = styled("span")(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: "0.1em",
  color: theme.palette.text.primary,
}));

export const KindBadges = styled("div")(({ theme }) => ({
  marginLeft: "auto",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
}));

/** One badge per active communication range; several = simultaneous operation. */
export const KindBadge = styled("span", {
  shouldForwardProp: (prop) => prop !== "status" && prop !== "muted",
})<{ status: LinkStatus; muted?: boolean }>(({ theme, status, muted }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 2,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(theme.palette.status[status], muted ? 0.35 : 0.9)}`,
  backgroundColor: alpha(theme.palette.status[status], muted ? 0.06 : 0.16),
  padding: "0 3px",
  fontSize: "0.45rem",
  letterSpacing: "0.08em",
  color: muted ? theme.palette.text.secondary : theme.palette.status[status],
  "& .MuiSvgIcon-root": { fontSize: "0.6rem" },
}));

export const CardSection = styled("div")(({ theme }) => ({
  padding: theme.spacing(1, 1.5),
}));

export const CardDetails = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  padding: theme.spacing(1, 1.5),
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
}));

export const RateText = styled("span", {
  shouldForwardProp: (prop) => prop !== "status",
})<{ status: LinkStatus }>(({ theme, status }) => ({
  color: status === "good" ? theme.palette.text.secondary : theme.palette.status[status],
  fontWeight: status === "good" ? 400 : 600,
}));

export const CardMetaRow = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  color: theme.palette.text.secondary,
}));

/** A modem and everything it owns (SIMs, satellite metrics, radio channel). */
export const ModemGroup = styled("div")(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(theme.palette.divider, 0.9)}`,
  backgroundColor: alpha(theme.palette.background.paper, 0.35),
  padding: theme.spacing(0.75),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.75),
  minWidth: 0,
}));

export const ModemHeaderRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
  minWidth: 0,
}));

export const ModemKind = styled("span")(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: "0.06em",
  color: theme.palette.text.primary,
}));

export const ModemName = styled("span")(({ theme }) => ({
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "0.45rem",
  letterSpacing: "0.06em",
  color: theme.palette.primary.main,
}));

export const ModemSpacer = styled("span")({ flex: 1, minWidth: 0 });

export const NestedList = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.75),
  borderLeft: `2px solid ${alpha(theme.palette.primary.main, 0.4)}`,
  paddingLeft: theme.spacing(1),
}));

export const LockRow = styled("span")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  "& .MuiSvgIcon-root": { fontSize: "0.65rem" },
}));

export const LockState = styled("span", {
  shouldForwardProp: (prop) => prop !== "locked",
})<{ locked: boolean }>(({ theme, locked }) => ({
  fontSize: "0.45rem",
  color: locked ? theme.palette.status.good : theme.palette.status.poor,
}));

/** Shared 4-column grid so every asset row lines up: label | bar | value | toggle. */
export const AssetRow = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "42px minmax(0, 1fr) 40px 26px",
  alignItems: "center",
  columnGap: theme.spacing(0.75),
  minWidth: 0,
}));

export const AssetLabel = styled("span")(({ theme }) => ({
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  letterSpacing: "0.04em",
  color: theme.palette.text.primary,
}));

export const AssetValue = styled("span", {
  shouldForwardProp: (prop) => prop !== "status",
})<{ status?: LinkStatus }>(({ theme, status }) => ({
  minWidth: 0,
  textAlign: "right",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "0.5rem",
  color: status && status !== "good" ? theme.palette.status[status] : theme.palette.text.secondary,
}));

export const AssetToggleCell = styled("div")({
  display: "flex",
  justifyContent: "flex-end",
});

/** SINR / RSRP / RSSI readouts under the satellite modem. */
export const MetricGrid = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: theme.spacing(0.5),
  fontSize: "0.45rem",
  color: theme.palette.text.secondary,
}));

export const MetricCell = styled("span")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
  padding: "1px 3px",
  minWidth: 0,
  overflow: "hidden",
}));

export const MetricName = styled("span")(({ theme }) => ({
  letterSpacing: "0.06em",
  color: theme.palette.text.secondary,
}));

export const MetricValue = styled("span")(({ theme }) => ({
  fontWeight: 600,
  whiteSpace: "nowrap",
  color: theme.palette.text.primary,
}));

export const CameraButton = styled(ButtonBase)(({ theme }) => ({
  width: "100%",
  gap: theme.spacing(1),
  padding: theme.spacing(0.75, 1),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.6)}`,
  backgroundColor: alpha(theme.palette.primary.main, 0.12),
  color: theme.palette.primary.main,
  fontSize: "0.5rem",
  letterSpacing: "0.14em",
  "& .MuiSvgIcon-root": { fontSize: "0.7rem" },
  "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.22) },
}));
