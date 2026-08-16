import type { ReactNode } from "react";
import Collapse from "@mui/material/Collapse";
import CpuIcon from "@mui/icons-material/Memory";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import { CollapseButton } from "@/components/GLOBAL/CollapseButton";
import { PowerToggle } from "@/components/GLOBAL/PowerToggle";
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
  temperature?: string;
  cpuUsage?: string;
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

        {(temperature || cpuUsage) && (
          <AssetMetrics>
            {temperature && (
              <span>
                <ThermostatIcon /> {temperature}
              </span>
            )}
            {cpuUsage && (
              <span>
                <CpuIcon /> CPU {cpuUsage}
              </span>
            )}
          </AssetMetrics>
        )}
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
