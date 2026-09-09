import { alpha, styled } from "@mui/material/styles";

export const AssetHeaderRoot = styled("div")(({ theme }) => ({
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  padding: theme.spacing(2, 2.5),
}));

export const AssetHeaderRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
}));

export const AssetName = styled("span")(({ theme }) => ({
  fontSize: "0.75rem",
  fontWeight: 600,
  letterSpacing: "0.1em",
  color: theme.palette.text.primary,
}));

export const AssetIconWrap = styled("span")(({ theme }) => ({
  display: "inline-flex",
  color: theme.palette.primary.main,
  "& .MuiSvgIcon-root": { fontSize: "0.95rem" },
}));

export const AssetMetrics = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(4),
  marginTop: theme.spacing(1.5),
  fontSize: "0.75rem",
  color: theme.palette.text.secondary,
  "& > span": { display: "inline-flex", alignItems: "center", gap: theme.spacing(1) },
  "& .MuiSvgIcon-root": { fontSize: "0.8rem" },
}));

export const AssetBodyRoot = styled("div")(({ theme }) => ({
  borderBottomLeftRadius: theme.shape.borderRadius,
  borderBottomRightRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  borderTop: "none",
  backgroundColor: alpha(theme.palette.background.paper, 0.3),
  padding: theme.spacing(1, 2.5),
}));

export const AssetBodyInner = styled("div")(({ theme }) => ({
  borderLeft: `2px solid ${alpha(theme.palette.primary.main, 0.4)}`,
  paddingLeft: theme.spacing(2.5),
}));

export const AssetSpacer = styled("div")({ flex: 1 });

/** Inline link-quality bar shown in the asset header. */
export const AssetQuality = styled("div")({
  width: 64,
  flexShrink: 0,
});
