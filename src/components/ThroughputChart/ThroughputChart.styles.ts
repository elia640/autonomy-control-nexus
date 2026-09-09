import { styled } from "@mui/material/styles";

export const ChartRoot = styled("div")(({ theme }) => ({
  padding: theme.spacing(2.5, 2),
}));

export const ChartCanvas = styled("div")({
  height: 150,
  width: "100%",
});

export const ChartLegend = styled("div")(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: theme.spacing(2, 4),
  marginTop: theme.spacing(2),
  paddingInline: theme.spacing(2),
}));

/** Recharts needs plain style objects, so axis styling is described here. */
export const chartAxisStyles = (axisColor: string, tickColor: string) => ({
  tick: { fontSize: 11, fill: tickColor },
  line: { stroke: axisColor },
  label: { fontSize: 11, fill: tickColor },
});
