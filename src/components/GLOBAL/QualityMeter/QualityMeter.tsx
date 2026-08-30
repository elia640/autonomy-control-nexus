import { QualityBar } from "@/components/GLOBAL/QualityBar";
import { MeterBar, MeterRoot } from "./QualityMeter.styles";

export interface QualityMeterProps {
  /** Signal quality, 0-100. */
  value: number;
  disabled?: boolean;
  ariaLabel?: string;
}

/** Quality bar with its 0-100 score rendered inside the track. */
export function QualityMeter({ value, disabled, ariaLabel }: QualityMeterProps) {
  const shown = disabled ? 0 : Math.round(value);

  return (
    <MeterRoot>
      <MeterBar>
        <QualityBar
          value={shown}
          disabled={disabled ?? false}
          ariaLabel={ariaLabel ?? "Quality"}
          showValue
        />
      </MeterBar>
    </MeterRoot>
  );
}
