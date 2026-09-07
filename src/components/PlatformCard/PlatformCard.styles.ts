import ButtonBase from "@mui/material/ButtonBase";
import { alpha, styled } from "@mui/material/styles";
import type { LinkStatus } from "@/types/network";

export type PlatformCardVariant = "overlay" | "topology";

export const CardRoot = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "variant" &&
    prop !== "status" &&
    prop !== "selected" &&
    prop !== "clickable" &&
    prop !== "dense",
})<{
  variant: PlatformCardVariant;
  status: LinkStatus;
  selected?: boolean;
  clickable?: boolean;
  dense?: boolean;
}>(({ theme, variant, status, selected, clickable, dense }) => ({
  width: variant === "overlay" ? (dense ? 60 : 76) : 220,
  cursor: clickable ? "pointer" : "default",
  boxShadow: selected ? `0 0 0 2px ${alpha(theme.palette.primary.main, 0.9)}` : "none",
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${
    variant === "overlay" ? theme.palette.divider : theme.palette.status[status]
  }`,
  backgroundColor:
    variant === "overlay"
      ? alpha(theme.palette.background.default, 0.92)
      : alpha(theme.palette.background.paper, 0.6),
  backdropFilter: variant === "overlay" ? "blur(4px)" : "none",
  fontSize: variant === "overlay" ? "0.625rem" : "0.6875rem",
  lineHeight: 1.3,
  pointerEvents: "auto",
  marginTop: variant === "overlay" ? theme.spacing(1) : 0,
}));

export const CardHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.5, 0.75),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
}));

export const CardTitle = styled("span")(({ theme }) => ({
  whiteSpace: "nowrap",
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

/**
 * One badge per active communication range; several = simultaneous operation.
 * Kept neutral grey so only the quality bar carries status colour.
 */
export const KindBadge = styled("span")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 2,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(theme.palette.divider, 0.9)}`,
  backgroundColor: alpha(theme.palette.text.secondary, 0.08),
  padding: "0 3px",
  fontSize: "0.45rem",
  letterSpacing: "0.08em",
  color: theme.palette.text.secondary,
  "& .MuiSvgIcon-root": { fontSize: "0.6rem", color: theme.palette.text.secondary },
}));

export const CardSection = styled("div")(({ theme }) => ({
  padding: theme.spacing(0.5, 0.75),
}));

export const CardDetails = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.5, 0.75),
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
  padding: theme.spacing(0.5),
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
  gridTemplateColumns: "22px minmax(0, 1fr) auto auto",
  alignItems: "center",
  columnGap: theme.spacing(0.5),
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
  fontWeight: 600,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "0.5625rem",
  color: status && status !== "good" ? theme.palette.status[status] : theme.palette.text.secondary,
}));

export const AssetToggleCell = styled("div")({
  display: "flex",
  justifyContent: "flex-start",
});

/** Download rate and latency shown on the collapsed map card. */
export const CompactMetaRow = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  gap: theme.spacing(1),
  padding: theme.spacing(0, 0.75, 0.5),
  fontSize: "0.5625rem",
  fontVariantNumeric: "tabular-nums",
  color: theme.palette.text.secondary,
}));

/** Red count of open alerts for the unit, mirroring the global tray badge. */
export const AlertBadge = styled("span")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 15,
  height: 15,
  padding: "0 4px",
  borderRadius: 999,
  backgroundColor: theme.palette.status.poor,
  color: theme.palette.common.white,
  fontSize: "0.55rem",
  fontWeight: 700,
}));

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
  padding: theme.spacing(0.5, 0.75),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.6)}`,
  backgroundColor: alpha(theme.palette.primary.main, 0.12),
  color: theme.palette.primary.main,
  fontSize: "0.5rem",
  letterSpacing: "0.14em",
  "& .MuiSvgIcon-root": { fontSize: "0.7rem" },
  "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.22) },
}));

/** Minimal map marker card: short name + active ranges. */
export const CompactHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.25, 0.5),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
}));

export const CompactBody = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.25, 0.5),
}));

export const CameraIconButton = styled(ButtonBase)(({ theme }) => ({
  marginLeft: "auto",
  flex: "none",
  height: 16,
  width: 16,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.6)}`,
  backgroundColor: alpha(theme.palette.primary.main, 0.12),
  color: theme.palette.primary.main,
  "& .MuiSvgIcon-root": { fontSize: "0.7rem" },
  "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.24) },
}));
