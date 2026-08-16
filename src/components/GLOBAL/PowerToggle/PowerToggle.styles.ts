import { alpha, styled } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";

export const ToggleTrack = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== "on",
})<{ on: boolean }>(({ theme, on }) => ({
  position: "relative",
  flexShrink: 0,
  height: 14,
  width: 26,
  borderRadius: 999,
  border: `1px solid ${on ? alpha(theme.palette.primary.main, 0.7) : theme.palette.divider}`,
  backgroundColor: on
    ? alpha(theme.palette.primary.main, 0.3)
    : theme.palette.action.disabledBackground,
  boxShadow: on ? `0 0 6px ${alpha(theme.palette.primary.main, 0.5)}` : "none",
  transition: theme.transitions.create(["background-color", "border-color", "box-shadow"]),
}));

export const ToggleThumb = styled("span", {
  shouldForwardProp: (prop) => prop !== "on",
})<{ on: boolean }>(({ theme, on }) => ({
  position: "absolute",
  top: 1,
  left: on ? 13 : 1,
  height: 10,
  width: 10,
  borderRadius: "50%",
  backgroundColor: on ? theme.palette.primary.main : theme.palette.text.secondary,
  transition: theme.transitions.create(["left", "background-color"]),
}));
