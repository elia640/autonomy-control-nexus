import { useState } from "react";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { CollapseButton } from "@/components/GLOBAL/CollapseButton";
import { PowerToggle } from "@/components/GLOBAL/PowerToggle";
import { QualityMeter } from "@/components/GLOBAL/QualityMeter";
import { cpuStatus, rateStatus, temperatureStatus } from "@/lib/linkStatus";
import type { ChannelState, ModemAsset } from "@/types/network";
import {
  ChannelList,
  ChannelName,
  ChannelRow,
  HeaderRow,
  MetaItem,
  MetaRow,
  PanelName,
  PanelRoot,
  RateCell,
  ResetButton,
  StateChip,
  ValueText,
} from "./ModemPanel.styles";

export interface ModemPanelProps {
  modem: ModemAsset;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  onReset?: (modemId: string) => void;
}

const STATE_LABEL: Record<ChannelState, string> = {
  connected: "CONNECTED",
  disconnected: "NOT CONNECTED",
  absent: "NO SIM",
  unplugged: "UNPLUGGED",
};

/** Channels with no hardware present cannot be powered. */
const isPowerable = (state: ChannelState) => state === "connected" || state === "disconnected";

export function ModemPanel({ modem, expanded, onExpandedChange, onReset }: ModemPanelProps) {
  const [off, setOff] = useState<Record<string, boolean>>({});
  const powerable = modem.channels.filter((c) => isPowerable(c.state));
  const activeCount = powerable.filter((c) => !off[c.id]).length;

  return (
    <PanelRoot>
      <HeaderRow>
        <CollapseButton
          expanded={expanded}
          onToggle={() => onExpandedChange(!expanded)}
          label={`${modem.name} channels`}
        />
        <PanelName>{modem.name}</PanelName>
        <QualityMeter value={modem.quality} ariaLabel={`${modem.name} quality`} />
        <ResetButton
          variant="outlined"
          size="small"
          startIcon={<RestartAltIcon sx={{ fontSize: "0.7rem" }} />}
          onClick={() => onReset?.(modem.id)}
        >
          Reset
        </ResetButton>
      </HeaderRow>

      <MetaRow>
        <MetaItem>
          {modem.rateLabel}{" "}
          <ValueText tone={rateStatus(modem.rate)}>{modem.rate.toFixed(1)} Mbps</ValueText>
        </MetaItem>
        <MetaItem>
          CPU TEMP{" "}
          <ValueText tone={temperatureStatus(modem.cpuTemperature)}>
            {modem.cpuTemperature}°C
          </ValueText>
        </MetaItem>
        <MetaItem>
          CPU LOAD <ValueText tone={cpuStatus(modem.cpuLoad)}>{modem.cpuLoad}%</ValueText>
        </MetaItem>
      </MetaRow>

      {expanded && (
        <ChannelList>
          {modem.channels.map((ch) => {
            const powerable_ = isPowerable(ch.state);
            const on = powerable_ && !off[ch.id];
            return (
              <ChannelRow key={ch.id}>
                <ChannelName>{ch.label}</ChannelName>
                <StateChip state={on ? ch.state : powerable_ ? "disconnected" : ch.state}>
                  {on ? STATE_LABEL[ch.state] : powerable_ ? "NOT CONNECTED" : STATE_LABEL[ch.state]}
                </StateChip>
                <QualityMeter
                  value={ch.quality}
                  disabled={!on}
                  ariaLabel={`${ch.label} quality`}
                />
                <RateCell>
                  {on ? (
                    <ValueText tone={rateStatus(ch.rate)}>{ch.rate.toFixed(1)}</ValueText>
                  ) : (
                    "—"
                  )}
                </RateCell>
                <PowerToggle
                  checked={on}
                  disabled={!powerable_}
                  label={`${modem.name} ${ch.label}`}
                  lastActive={on && activeCount <= 1}
                  onChange={(next) => setOff((prev) => ({ ...prev, [ch.id]: !next }))}
                />
              </ChannelRow>
            );
          })}
        </ChannelList>
      )}
    </PanelRoot>
  );
}
