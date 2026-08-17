import { styled } from "@mui/material/styles";

export const LinkRowRoot = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2.5),
  padding: theme.spacing(1.5, 0),
}));

export const LinkRowLabel = styled("span")(({ theme }) => ({
  width: 56,
  flexShrink: 0,
  fontSize: "0.6875rem",
  letterSpacing: "0.08em",
  color: theme.palette.text.primary,
}));

export const LinkRowBar = styled("div")({
  flex: 1,
  minWidth: 0,
});

export const LinkRowRate = styled("span", {
  shouldForwardProp: (prop) => prop !== "muted" && prop !== "status",
})<{ muted?: boolean | undefined; status?: "good" | "marginal" | "poor" }>(
  ({ theme, muted, status }) => ({
  width: 62,
  flexShrink: 0,
  textAlign: "right",
  fontSize: "0.625rem",
  color:
    status && status !== "good" ? theme.palette.status[status] : theme.palette.text.secondary,
  fontWeight: status && status !== "good" ? 600 : 400,
  opacity: muted ? 0.4 : 1,
}),
);
