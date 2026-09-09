import { styled } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";

export const ChartRoot = styled("div")(({ theme }) => ({
  padding: theme.spacing(2, 2, 1),
}));

export const ChartCanvas = styled("div")({ height: 200, width: "100%" });

export const ChartLegend = styled("div")(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(1, 3),
  padding: theme.spacing(1.5, 1, 0),
}));

export const chartAxisStyles = (theme: Theme) => ({
  tick: { fill: theme.palette.text.secondary, fontSize: 12 },
  line: { stroke: theme.palette.divider },
  label: { fill: theme.palette.text.secondary, fontSize: 12 },
});
