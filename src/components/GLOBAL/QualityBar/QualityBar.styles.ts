import { styled } from "@mui/material/styles";

export const QualityBarTrack = styled("div", {
  shouldForwardProp: (prop) => prop !== "muted",
})<{ muted?: boolean | undefined }>(({ theme, muted }) => ({
  position: "relative",
  height: 10,
  width: "100%",
  overflow: "hidden",
  borderRadius: 999,
  backgroundColor: theme.palette.action.hover,
  opacity: muted ? 0.3 : 1,
}));

export const QualityBarFill = styled("div", {
  shouldForwardProp: (prop) => prop !== "fillColor",
})<{ fillColor: string }>(({ theme, fillColor }) => ({
  height: "100%",
  borderRadius: 999,
  transition: theme.transitions.create(["width", "background-color"]),
  backgroundColor: fillColor,
}));

