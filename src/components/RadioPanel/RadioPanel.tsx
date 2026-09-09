import CellTowerIcon from "@mui/icons-material/CellTower";
import { HealthMetrics } from "@/components/GLOBAL/HealthMetrics";
import { PowerToggle } from "@/components/GLOBAL/PowerToggle";
import { QualityMeter } from "@/components/GLOBAL/QualityMeter";
import { rateStatus } from "@/lib/linkStatus";
import type { RadioAsset } from "@/types/network";
import {
  AssetIcon,
  HeaderRow,
  HealthRow,
  MeterRow,
  NameBlock,
  PanelName,
  PanelRoot,
  RateText,
  ValueText,
} from "./RadioPanel.styles";

export interface RadioPanelProps {
  radio: RadioAsset;
  /** Kept for API compatibility; the radio panel has no expandable menu. */
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  /** Blocks switching off the last active unit. */
  lastActive?: boolean;
}

export function RadioPanel({
  radio,
  enabled,
  onEnabledChange,
  lastActive = false,
}: RadioPanelProps) {
  return (
    <PanelRoot>
      <HeaderRow>
        <PowerToggle
          checked={enabled}
          onChange={onEnabledChange}
          label={radio.name}
          lastActive={lastActive}
        />
        <AssetIcon>
          <CellTowerIcon />
        </AssetIcon>
        <NameBlock>
          <PanelName>{radio.name}</PanelName>
        </NameBlock>
      </HeaderRow>

      <MeterRow>
        <QualityMeter
          value={radio.quality}
          disabled={!enabled}
          ariaLabel={`${radio.name} quality`}
        />
        <RateText>
          <ValueText tone={rateStatus(radio.rate)}>
            {enabled ? `${radio.rate.toFixed(1)} Mbps (RX)` : "—"}
          </ValueText>
        </RateText>
      </MeterRow>

      <HealthRow>
        <HealthMetrics temperature={radio.temperature} voltage={radio.voltage} dense />
      </HealthRow>

    </PanelRoot>
  );
}
