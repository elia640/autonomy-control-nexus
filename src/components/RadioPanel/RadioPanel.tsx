import CellTowerIcon from "@mui/icons-material/CellTower";
import { CollapseButton } from "@/components/GLOBAL/CollapseButton";
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
        <AssetIcon>
          <CellTowerIcon />
        </AssetIcon>
        <NameBlock>
          <PanelName>{radio.name}</PanelName>
        </NameBlock>
        <PowerToggle
          checked={enabled}
          onChange={onEnabledChange}
          label={radio.name}
          lastActive={lastActive}
        />
      </HeaderRow>

      <MeterRow>
        <QualityMeter
          value={radio.quality}
          disabled={!enabled}
          ariaLabel={`${radio.name} quality`}
        />
        <RateText>
          {radio.rateLabel}{" "}
          <ValueText tone={rateStatus(radio.rate)}>
            {enabled ? `${radio.rate.toFixed(1)} Mbps` : "—"}
          </ValueText>
        </RateText>
      </MeterRow>

      <HealthRow>
        <HealthMetrics temperature={radio.temperature} voltage={radio.voltage} dense />
      </HealthRow>

    </PanelRoot>
  );
}
