import { PowerToggle } from "@/components/GLOBAL/PowerToggle";
import { QualityBar } from "@/components/GLOBAL/QualityBar";
import { parseRate, rateStatus } from "@/lib/linkStatus";
import { LinkRowBar, LinkRowLabel, LinkRowRate, LinkRowRoot } from "./CommsLinkRow.styles";

export interface CommsLinkRowProps {
  label: string;
  /** Signal quality, 0-100. */
  quality: number;
  /** Formatted throughput, e.g. "12.5 Mbps". */
  rate?: string;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  /** Blocks switching off when this is the last active link. */
  lastActive?: boolean;
}

export function CommsLinkRow({
  label,
  quality,
  rate,
  enabled,
  onEnabledChange,
  lastActive = false,
}: CommsLinkRowProps) {
  return (
    <LinkRowRoot>
      <LinkRowLabel>{label}</LinkRowLabel>
      <PowerToggle checked={enabled} onChange={onEnabledChange} label={label} lastActive={lastActive} />
      <LinkRowBar>
        <QualityBar value={enabled ? quality : 0} disabled={!enabled} ariaLabel={`${label} quality`} />
      </LinkRowBar>
      {rate !== undefined && <LinkRowRate muted={!enabled} status={rateStatus(parseRate(rate))}>{enabled ? rate : "—"}</LinkRowRate>}
    </LinkRowRoot>
  );
}
