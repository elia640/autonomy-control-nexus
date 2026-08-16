import {
  SeriesCheckboxInput,
  SeriesFormControlLabel,
  SeriesSwatch,
} from "./SeriesCheckbox.styles";

export interface SeriesCheckboxProps {
  label: string;
  color: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function SeriesCheckbox({ label, color, checked, onChange }: SeriesCheckboxProps) {
  return (
    <SeriesFormControlLabel
      control={
        <SeriesCheckboxInput
          seriesColor={color}
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          slotProps={{ input: { "aria-label": label } }}
        />
      }
      label={
        <>
          <SeriesSwatch seriesColor={color} />
          {label}
        </>
      }
    />
  );
}
