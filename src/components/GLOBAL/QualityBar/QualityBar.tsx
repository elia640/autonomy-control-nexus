import { QualityBarFill, QualityBarTrack } from "./QualityBar.styles";

export interface QualityBarProps {
  /** Signal quality, 0-100. */
  value: number;
  disabled?: boolean;
  ariaLabel?: string;
}

const clamp = (value: number): number => Math.max(0, Math.min(100, value));

export function QualityBar({ value, disabled, ariaLabel }: QualityBarProps) {
  const percent = clamp(value);

  return (
    <QualityBarTrack
      muted={disabled}
      role="progressbar"
      aria-label={ariaLabel ?? "Link quality"}
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <QualityBarFill style={{ width: `${percent}%` }} />
    </QualityBarTrack>
  );
}
