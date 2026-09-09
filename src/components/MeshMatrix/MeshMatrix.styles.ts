import { styled } from "@mui/material/styles";

export const MatrixRoot = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
}));

export const MatrixFrame = styled("div")(({ theme }) => ({
  overflow: "hidden",
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
}));

export const MatrixTable = styled("table")({
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.5625rem",
});

export const MatrixHeadCell = styled("th", {
  shouldForwardProp: (prop) => prop !== "highlighted",
})<{ highlighted?: boolean }>(({ theme, highlighted }) => ({
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.panel.header,
  padding: theme.spacing(1),
  textAlign: "center",
  fontWeight: 400,
  letterSpacing: "0.08em",
  color: highlighted ? theme.palette.primary.main : theme.palette.text.secondary,
}));

export const MatrixRowHeadCell = styled(MatrixHeadCell)({ textAlign: "left" });

export const MatrixCell = styled("td", {
  shouldForwardProp: (prop) => prop !== "cellColor",
})<{ cellColor?: string | undefined }>(({ theme, cellColor }) => ({
  border: `1px solid ${theme.palette.divider}`,
  padding: 0,
  height: 20,
  textAlign: "center",
  fontWeight: 600,
  backgroundColor: cellColor ?? "transparent",
  color: cellColor ? theme.palette.common.black : theme.palette.text.secondary,
}));

export const FrequencyRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.panel.header,
  padding: theme.spacing(1, 1.5),
  fontSize: "0.5625rem",
  color: theme.palette.text.primary,
}));

export const FrequencyLabel = styled("span")(({ theme }) => ({
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: theme.palette.text.secondary,
}));

export const MatrixLegend = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  marginTop: theme.spacing(1.5),
  fontSize: "0.5625rem",
  color: theme.palette.text.secondary,
}));

export const LegendItem = styled("span")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(1),
  textTransform: "uppercase",
  letterSpacing: "0.08em",
}));

export const LegendSquare = styled("span", {
  shouldForwardProp: (prop) => prop !== "swatchColor",
})<{ swatchColor: string }>(({ swatchColor }) => ({
  height: 8,
  width: 8,
  borderRadius: 2,
  backgroundColor: swatchColor,
}));

/** Metric selector shown above the matrix. */
export const MatrixModes = styled("div")(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(1.5),
}));
