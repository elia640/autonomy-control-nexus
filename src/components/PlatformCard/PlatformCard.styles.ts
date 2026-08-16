import { alpha, styled } from "@mui/material/styles";
import type { LinkStatus } from "@/types/network";

export type PlatformCardVariant = "overlay" | "topology";

export const CardRoot = styled("div", {
  shouldForwardProp: (prop) => prop !== "variant" && prop !== "status",
})<{ variant: PlatformCardVariant; status: LinkStatus }>(({ theme, variant, status }) => ({
  width: variant === "overlay" ? 132 : 180,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${
    variant === "overlay" ? theme.palette.divider : theme.palette.status[status]
  }`,
  backgroundColor:
    variant === "overlay"
      ? alpha(theme.palette.background.default, 0.9)
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

export const CardLinkKind = styled("span", {
  shouldForwardProp: (prop) => prop !== "status",
})<{ status: LinkStatus }>(({ theme, status }) => ({
  marginLeft: "auto",
  letterSpacing: "0.08em",
  color: theme.palette.status[status],
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

export const CardMetaRow = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  color: theme.palette.text.secondary,
}));

export const NestedList = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  borderLeft: `2px solid ${alpha(theme.palette.primary.main, 0.4)}`,
  paddingLeft: theme.spacing(1.5),
}));

export const NestedRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
}));

export const NestedLabel = styled("span")(({ theme }) => ({
  width: 32,
  flexShrink: 0,
  color: theme.palette.text.primary,
}));

export const NestedBar = styled("div")({ flex: 1, minWidth: 0 });

export const LockRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  "& .MuiSvgIcon-root": { fontSize: "0.7rem" },
}));

export const LockState = styled("span", {
  shouldForwardProp: (prop) => prop !== "locked",
})<{ locked: boolean }>(({ theme, locked }) => ({
  color: locked ? theme.palette.status.good : theme.palette.status.poor,
}));

export const ConnectionState = styled("span")(({ theme }) => ({
  marginLeft: "auto",
  color: theme.palette.text.secondary,
}));
