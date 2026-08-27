import CellTowerIcon from "@mui/icons-material/CellTower";
import { CollapseButton } from "@/components/GLOBAL/CollapseButton";
import { HealthMetrics } from "@/components/GLOBAL/HealthMetrics";
import { PowerToggle } from "@/components/GLOBAL/PowerToggle";
import { QualityMeter } from "@/components/GLOBAL/QualityMeter";
import { rateStatus } from "@/lib/linkStatus";
import type { RadioAsset } from "@/types/network";
import {
  AssetIcon,
  DetailItem,
  HeaderRow,
  MetaRow,
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
        <AssetIcon>
          <CellTowerIcon />
        </AssetIcon>
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

      <MetaRow>
        <DetailItem>
          {radio.rateLabel}{" "}
          <ValueText tone={rateStatus(radio.rate)}>
            {enabled ? `${radio.rate.toFixed(1)} Mbps` : "—"}
          </ValueText>
        </DetailItem>
        <DetailItem>
          <HealthMetrics temperature={radio.temperature} voltage={radio.voltage} />
        </DetailItem>
      </MetaRow>
    </PanelRoot>
  );
}
