import { CollapseButton } from "@/components/GLOBAL/CollapseButton";
import { PowerToggle } from "@/components/GLOBAL/PowerToggle";
import { QualityMeter } from "@/components/GLOBAL/QualityMeter";
import { rateStatus, temperatureStatus, voltageStatus } from "@/lib/linkStatus";
import type { RadioAsset } from "@/types/network";
import {
  DetailItem,
  DetailRow,
  HeaderRow,
  PanelName,
  PanelRoot,
  ValueText,
} from "./RadioPanel.styles";

export interface RadioPanelProps {
  radio: RadioAsset;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  /** Blocks switching off the last active unit. */
  lastActive?: boolean;
}

export function RadioPanel({
  radio,
  expanded,
  onExpandedChange,
  enabled,
  onEnabledChange,
  lastActive = false,
}: RadioPanelProps) {
  return (
    <PanelRoot>
      <HeaderRow>
        <CollapseButton
          expanded={expanded}
          onToggle={() => onExpandedChange(!expanded)}
          label={`${radio.name} details`}
        />
        <PanelName>{radio.name}</PanelName>
        <QualityMeter
          value={radio.quality}
          disabled={!enabled}
          ariaLabel={`${radio.name} quality`}
        />
        <PowerToggle
          checked={enabled}
          onChange={onEnabledChange}
          label={radio.name}
          lastActive={lastActive}
        />
      </HeaderRow>

      {expanded && (
        <DetailRow>
          <DetailItem>
            {radio.rateLabel}{" "}
            <ValueText tone={rateStatus(radio.rate)}>
              {enabled ? `${radio.rate.toFixed(1)} Mbps` : "—"}
            </ValueText>
          </DetailItem>
          <DetailItem>
            TEMP{" "}
            <ValueText tone={temperatureStatus(radio.temperature)}>{radio.temperature}°C</ValueText>
          </DetailItem>
          <DetailItem>
            VOLTAGE{" "}
            <ValueText tone={voltageStatus(radio.voltage)}>{radio.voltage.toFixed(1)}V</ValueText>
          </DetailItem>
        </DetailRow>
      )}
    </PanelRoot>
  );
}
