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
  /** Blocks switching off when this is the last active communication range. */
  lastActive?: boolean;
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
  quality,
  lastActive = false,
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
          {quality !== undefined && (
            <AssetQuality>
              <QualityBar
                value={enabled ? quality : 0}
                disabled={!enabled}
                ariaLabel={`${name} link quality`}
              />
            </AssetQuality>
          )}
          <AssetSpacer />
          <StatusIndicator status={statusTone} label={statusLabel} />
          <PowerToggle checked={enabled} onChange={onEnabledChange} label={name} lastActive={lastActive} />
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
