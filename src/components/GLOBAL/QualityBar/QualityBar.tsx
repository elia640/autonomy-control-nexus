import { useTheme } from "@mui/material/styles";
import { qualityStatus } from "@/lib/linkStatus";
import { QualityBarFill, QualityBarTrack, QualityBarValue } from "./QualityBar.styles";

export interface QualityBarProps {
  /** Signal quality, 0-100. */
  value: number;
  disabled?: boolean;
  ariaLabel?: string;
  /** Render the percentage inside the track. */
  showValue?: boolean;
}

const clamp = (value: number): number => Math.max(0, Math.min(100, value));

export function QualityBar({ value, disabled, ariaLabel, showValue }: QualityBarProps) {
  const theme = useTheme();
  const percent = clamp(value);
  /** Inactive channels (NO SIM / UNPLUGGED) read neutral grey, never alarming red. */
  const color = disabled
    ? theme.palette.text.secondary
    : theme.palette.status[qualityStatus(percent)];

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
      {showValue && (
        <QualityBarValue tone={disabled ? theme.palette.text.secondary : theme.palette.text.primary}>
          {percent}%
        </QualityBarValue>
      )}
    </QualityBarTrack>
  );
}
