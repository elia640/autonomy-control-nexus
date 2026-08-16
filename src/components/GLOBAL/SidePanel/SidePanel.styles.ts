import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

export const SidePanelRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== "side" && prop !== "width",
})<{ side: "left" | "right"; width: number }>(({ theme, side, width }) => ({
  display: "flex",
  flexDirection: "column",
  flexShrink: 0,
  width,
  height: "100%",
  overflow: "hidden",
  backgroundColor: theme.palette.panel.surface,
  ...(side === "left"
    ? { borderRight: `1px solid ${theme.palette.divider}` }
    : { borderLeft: `1px solid ${theme.palette.divider}` }),
}));

export const SidePanelScroll = styled(Box)({
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
});
