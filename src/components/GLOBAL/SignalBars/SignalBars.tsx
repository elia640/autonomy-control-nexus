import { useTheme } from "@mui/material/styles";
import { qualityStatus } from "@/lib/linkStatus";
import { Bar, BarsRoot, BarsTrack, BarsValue } from "./SignalBars.styles";

export interface SignalBarsProps {
  /** Signal quality, 0-100. */
  value: number;
  disabled?: boolean;
  ariaLabel?: string;
  /** Render the percentage next to the notches. Defaults to true. */
  showValue?: boolean;
  /** Number of notches. Defaults to 5. */
  bars?: number;
}

const clamp = (value: number): number => Math.max(0, Math.min(100, value));

/** Compact cellular-reception indicator: green / orange / red notches. */
export function SignalBars({
  value,
  disabled,
  ariaLabel,
  showValue = true,
  bars = 5,
}: SignalBarsProps) {
  const theme = useTheme();
  const percent = clamp(Math.round(value));
  const tone = disabled
    ? theme.palette.text.secondary
    : theme.palette.status[qualityStatus(percent)];
  const filled = disabled ? 0 : Math.ceil((percent / 100) * bars);

  return (
    <BarsRoot
      role="progressbar"
      aria-label={ariaLabel ?? "Link quality"}
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <BarsTrack>
        {Array.from({ length: bars }, (_, index) => (
          <Bar key={index} level={index} tone={tone} filled={index < filled} />
        ))}
      </BarsTrack>
      {showValue && <BarsValue tone={tone}>{percent}%</BarsValue>}
    </BarsRoot>
  );
}
