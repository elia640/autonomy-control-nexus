import { QualityBar } from "@/components/GLOBAL/QualityBar";
import { qualityStatus } from "@/lib/linkStatus";
import { MeterBar, MeterRoot, MeterScore } from "./QualityMeter.styles";

export interface QualityMeterProps {
  /** Signal quality, 0-100. */
  value: number;
  disabled?: boolean;
  ariaLabel?: string;
}

/** Quality bar plus its numeric 1-100 score. */
export function QualityMeter({ value, disabled, ariaLabel }: QualityMeterProps) {
  const shown = disabled ? 0 : Math.round(value);

  return (
    <MeterRoot>
      <MeterBar>
        <QualityBar value={shown} disabled={disabled ?? false} ariaLabel={ariaLabel ?? "Quality"} />
      </MeterBar>
      <MeterScore tone={qualityStatus(shown)}>{shown}%</MeterScore>
    </MeterRoot>
  );
}
