import { useTheme } from "@mui/material/styles";
import { qualityStatus } from "@/lib/linkStatus";
import { QualityBarFill, QualityBarTrack } from "./QualityBar.styles";

export interface QualityBarProps {
  /** Signal quality, 0-100. */
  value: number;
  disabled?: boolean;
  ariaLabel?: string;
}

const clamp = (value: number): number => Math.max(0, Math.min(100, value));

export function QualityBar({ value, disabled, ariaLabel }: QualityBarProps) {
  const theme = useTheme();
  const percent = clamp(value);
  const color = theme.palette.status[qualityStatus(percent)];

  return (
    <QualityBarTrack
      muted={disabled}
      role="progressbar"
      aria-label={ariaLabel ?? "Link quality"}
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <QualityBarFill fillColor={color} style={{ width: `${percent}%` }} />
    </QualityBarTrack>
  );
}
