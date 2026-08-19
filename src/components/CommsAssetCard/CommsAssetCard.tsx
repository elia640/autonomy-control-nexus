import type { ReactNode } from "react";
import Collapse from "@mui/material/Collapse";
import { CollapseButton } from "@/components/GLOBAL/CollapseButton";
import { HealthMetrics } from "@/components/GLOBAL/HealthMetrics";
import { PowerToggle } from "@/components/GLOBAL/PowerToggle";
import { QualityBar } from "@/components/GLOBAL/QualityBar";
import { StatusIndicator } from "@/components/GLOBAL/StatusIndicator";
import type { LinkStatus } from "@/types/network";
import {
  AssetBodyInner,
  AssetBodyRoot,
  AssetHeaderRoot,
  AssetHeaderRow,
  AssetIconWrap,
  AssetMetrics,
  AssetName,
  AssetQuality,
  AssetSpacer,
} from "./CommsAssetCard.styles";

export interface CommsAssetCardProps {
  /** Hardware name, e.g. "MODEM CM-4200". */
  name: string;
  icon: ReactNode;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  statusLabel: string;
  statusTone: LinkStatus;
  /** Celsius. */
  temperature?: number;
  /** CPU load percent; omit for modems that do not report it. */
  cpuUsage?: number;
  /** Supply voltage in volts. */
  voltage?: number;
  /** Link quality 0-100; renders a status bar beside the asset name. */
  quality?: number;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** Nested links (SIMs, channels) revealed when expanded. */
  children?: ReactNode;
}

export function CommsAssetCard({
  name,
  icon,
  enabled,
  onEnabledChange,
  statusLabel,
  statusTone,
  temperature,
  cpuUsage,
  voltage,
  expanded,
  onExpandedChange,
  children,
}: CommsAssetCardProps) {
  const collapsible = children !== undefined && onExpandedChange !== undefined;
  const isExpanded = expanded ?? true;

  return (
    <div>
      <AssetHeaderRoot>
        <AssetHeaderRow>
          {collapsible && (
            <CollapseButton
              expanded={isExpanded}
              onToggle={() => onExpandedChange(!isExpanded)}
              label={`${name} links`}
            />
          )}
          <AssetIconWrap>{icon}</AssetIconWrap>
          <AssetName>{name}</AssetName>
          <AssetSpacer />
          <StatusIndicator status={statusTone} label={statusLabel} />
          <PowerToggle checked={enabled} onChange={onEnabledChange} label={name} />
        </AssetHeaderRow>

        <AssetMetrics>
          <HealthMetrics
            {...(temperature !== undefined ? { temperature } : {})}
            {...(cpuUsage !== undefined ? { cpu: cpuUsage } : {})}
            {...(voltage !== undefined ? { voltage } : {})}
          />
        </AssetMetrics>
      </AssetHeaderRoot>

      {children !== undefined && (
        <Collapse in={isExpanded} unmountOnExit>
          <AssetBodyRoot>
            <AssetBodyInner>{children}</AssetBodyInner>
          </AssetBodyRoot>
        </Collapse>
      )}
    </div>
  );
}
