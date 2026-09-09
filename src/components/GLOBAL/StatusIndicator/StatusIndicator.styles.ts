import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import type { LinkStatus } from "@/types/network";

export const StatusRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== "status",
})<{ status: LinkStatus }>(({ theme, status }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  fontSize: "0.6875rem",
  letterSpacing: "0.1em",
  color: theme.palette.status[status],
}));

export const StatusDot = styled("span", {
  shouldForwardProp: (prop) => prop !== "status",
})<{ status: LinkStatus }>(({ theme, status }) => ({
  height: 6,
  width: 6,
  borderRadius: "50%",
  backgroundColor: theme.palette.status[status],
}));
