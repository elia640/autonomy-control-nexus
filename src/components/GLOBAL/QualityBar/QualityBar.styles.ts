import { styled } from "@mui/material/styles";

export const QualityBarTrack = styled("div", {
  shouldForwardProp: (prop) => prop !== "muted",
})<{ muted?: boolean | undefined }>(({ theme, muted }) => ({
  position: "relative",
  height: 7,
  width: "100%",
  overflow: "hidden",
  borderRadius: 999,
  backgroundColor: theme.palette.action.hover,
  opacity: muted ? 0.3 : 1,
}));

export const QualityBarFill = styled("div")(({ theme }) => ({
  height: "100%",
  borderRadius: 999,
  transition: theme.transitions.create("width"),
  background: `linear-gradient(90deg, ${theme.palette.status.poor}, ${theme.palette.status.marginal} 45%, ${theme.palette.status.good})`,
}));
