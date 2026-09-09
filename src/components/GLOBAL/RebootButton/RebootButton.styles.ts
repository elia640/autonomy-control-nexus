import Button from "@mui/material/Button";
import { alpha, styled } from "@mui/material/styles";

/** Matches the outlined footer controls (Settings / Control Room). */
export const RebootRoot = styled(Button, {
  shouldForwardProp: (prop) => prop !== "progress",
})<{ progress: number }>(({ theme, progress }) => ({
  position: "relative",
  overflow: "hidden",
  marginLeft: "auto",
  minWidth: 104,
  padding: theme.spacing(1, 2),
  fontSize: "0.625rem",
  fontWeight: 600,
  letterSpacing: "0.16em",
  color: theme.palette.text.secondary,
  borderColor: theme.palette.divider,
  "&:hover": {
    color: theme.palette.primary.main,
    borderColor: alpha(theme.palette.primary.main, 0.6),
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
  "&.Mui-disabled": {
    color: theme.palette.primary.main,
    borderColor: alpha(theme.palette.primary.main, 0.6),
  },
  "& .MuiSvgIcon-root": { fontSize: "0.8rem" },
  /** Countdown progress fill sweeping across the control. */
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    width: `${progress}%`,
    backgroundColor: alpha(theme.palette.primary.main, 0.22),
    transition: "width 1s linear",
    pointerEvents: "none",
  },
}));

export const RebootLabel = styled("span")({
  position: "relative",
  zIndex: 1,
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontVariantNumeric: "tabular-nums",
});
