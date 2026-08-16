import { PowerToggle } from "@/components/GLOBAL/PowerToggle";
import { QualityBar } from "@/components/GLOBAL/QualityBar";
import { LinkRowBar, LinkRowLabel, LinkRowRate, LinkRowRoot } from "./CommsLinkRow.styles";

export interface CommsLinkRowProps {
  label: string;
  /** Signal quality, 0-100. */
  quality: number;
  /** Formatted throughput, e.g. "12.5 Mbps". */
  rate?: string;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
}

export function CommsLinkRow({
  label,
  quality,
  rate,
  enabled,
  onEnabledChange,
}: CommsLinkRowProps) {
  return (
    <LinkRowRoot>
      <LinkRowLabel>{label}</LinkRowLabel>
      <PowerToggle checked={enabled} onChange={onEnabledChange} label={label} />
      <LinkRowBar>
        <QualityBar value={enabled ? quality : 0} disabled={!enabled} ariaLabel={`${label} quality`} />
      </LinkRowBar>
      {rate !== undefined && <LinkRowRate muted={!enabled}>{enabled ? rate : "—"}</LinkRowRate>}
    </LinkRowRoot>
  );
}
