import { styled } from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

export const SeriesFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  margin: 0,
  gap: theme.spacing(1),
  "& .MuiFormControlLabel-label": {
    display: "inline-flex",
    alignItems: "center",
    gap: theme.spacing(1.5),
    fontSize: "0.6875rem",
    letterSpacing: "0.08em",
    color: theme.palette.text.secondary,
  },
}));

export const SeriesCheckboxInput = styled(Checkbox, {
  shouldForwardProp: (prop) => prop !== "seriesColor",
})<{ seriesColor: string }>(({ seriesColor }) => ({
  padding: 0,
  color: seriesColor,
  "&.Mui-checked": { color: seriesColor },
  "& .MuiSvgIcon-root": { fontSize: "0.9rem" },
}));

export const SeriesSwatch = styled("span", {
  shouldForwardProp: (prop) => prop !== "seriesColor",
})<{ seriesColor: string }>(({ seriesColor }) => ({
  display: "inline-block",
  height: 2,
  width: 12,
  backgroundColor: seriesColor,
}));
