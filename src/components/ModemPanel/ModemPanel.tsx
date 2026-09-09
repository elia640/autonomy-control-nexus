import { useState } from "react";
import CellIcon from "@mui/icons-material/SignalCellularAlt";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { HealthMetrics } from "@/components/GLOBAL/HealthMetrics";
import { CollapseButton } from "@/components/GLOBAL/CollapseButton";
import { PowerToggle } from "@/components/GLOBAL/PowerToggle";
import { RebootButton } from "@/components/GLOBAL/RebootButton";
import { QualityMeter } from "@/components/GLOBAL/QualityMeter";
import { SignalBars } from "@/components/GLOBAL/SignalBars";
import { rateStatus } from "@/lib/linkStatus";
import type { ChannelState, ModemAsset } from "@/types/network";
import {
  AssetIcon,
  ChannelGroup,
  ChannelList,
  ChannelName,
  ChannelNameButton,
  ChannelRow,
  MetricCell,
  MetricName,
  MetricValue,
  MetricsRow,
  HeaderRow,
  HealthRow,
  MeterRow,
  NameBlock,
  PanelName,
  PanelRoot,
  RateCell,
  RateText,
  RebootRow,
  StateChip,
  ValueText,
} from "./ModemPanel.styles";

export interface ModemPanelProps {
  modem: ModemAsset;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  /** Fired when the reboot cycle for the modem completes. */
  onReboot?: (modemId: string) => void;
}

/** Abbreviated so every channel row fits on a single line. */
const STATE_LABEL: Record<ChannelState, string> = {
  connected: "CONN",
  disconnected: "NO CONN",
  absent: "NO SIM",
  unplugged: "UNPLG",
};

/** Full wording kept as a tooltip for the abbreviated chips. */
const STATE_TITLE: Record<ChannelState, string> = {
  connected: "CONNECTED",
  disconnected: "NOT CONNECTED",
  absent: "NO SIM",
  unplugged: "UNPLUGGED",
};

/** Channels with no hardware present cannot be powered. */
const isPowerable = (state: ChannelState) => state === "connected" || state === "disconnected";

export function ModemPanel({ modem, expanded, onExpandedChange, onReboot }: ModemPanelProps) {
  const [off, setOff] = useState<Record<string, boolean>>({});
  /** Channels whose RF readouts (SINR / RSSI / RSRP) are expanded. */
  const [openMetrics, setOpenMetrics] = useState<Record<string, boolean>>({});
  /** Channels cannot be switched while the modem restarts. */
  const [rebooting, setRebooting] = useState(false);
  const powerable = modem.channels.filter((c) => isPowerable(c.state));
  const activeCount = powerable.filter((c) => !off[c.id]).length;

  return (
    <PanelRoot>
      <DimWrap dimmed={rebooting}>
      <HeaderRow>
        <CollapseButton
          expanded={expanded}
          onToggle={() => onExpandedChange(!expanded)}
          label={`${modem.name} channels`}
        />
        <AssetIcon>
          <CellIcon />
        </AssetIcon>
        <NameBlock>
          <PanelName>{modem.name}</PanelName>
        </NameBlock>
      </HeaderRow>

      <MeterRow>
        <QualityMeter value={modem.quality} ariaLabel={`${modem.name} quality`} />
        <RateText>
          <ValueText tone={rateStatus(modem.rate)}>{modem.rate.toFixed(1)} Mbps (RX)</ValueText>
        </RateText>
      </MeterRow>

      <HealthRow>
        <HealthMetrics temperature={modem.cpuTemperature} cpu={modem.cpuLoad} dense />
      </HealthRow>

      {expanded && (
          <ChannelList>
            {modem.channels.map((ch) => {
              const powerable_ = isPowerable(ch.state);
              const on = powerable_ && !off[ch.id];
              const metricsOpen = !!openMetrics[ch.id];
              return (
                <ChannelGroup key={ch.id}>
                  <ChannelRow>
                    <PowerToggle
                      checked={on}
                      disabled={!powerable_ || rebooting}
                      label={`${modem.name} ${ch.label}`}
                      lastActive={on && activeCount <= 1}
                      onChange={(next) => setOff((prev) => ({ ...prev, [ch.id]: !next }))}
                    />
                    {ch.metrics ? (
                      <ChannelNameButton
                        type="button"
                        aria-expanded={metricsOpen}
                        aria-label={`${ch.label} RF details`}
                        onClick={() =>
                          setOpenMetrics((prev) => ({ ...prev, [ch.id]: !prev[ch.id] }))
                        }
                      >
                        {ch.label}
                        {metricsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </ChannelNameButton>
                    ) : (
                      <ChannelName>{ch.label}</ChannelName>
                    )}
                    <StateChip
                      state={on ? ch.state : powerable_ ? "disconnected" : ch.state}
                      title={
                        on
                          ? STATE_TITLE[ch.state]
                          : powerable_
                            ? STATE_TITLE.disconnected
                            : STATE_TITLE[ch.state]
                      }
                    >
                      {on
                        ? STATE_LABEL[ch.state]
                        : powerable_
                          ? STATE_LABEL.disconnected
                          : STATE_LABEL[ch.state]}
                    </StateChip>
                    <SignalBars
                      value={ch.quality}
                      disabled={!on}
                      ariaLabel={`${ch.label} quality`}
                    />
                    <RateCell>
                      {on ? (
                        <ValueText tone={rateStatus(ch.rate)}>{ch.rate.toFixed(1)} (RX)</ValueText>
                      ) : (
                        "—"
                      )}
                    </RateCell>
                  </ChannelRow>
                  {ch.metrics && metricsOpen && (
                    <MetricsRow>
                      <MetricCell>
                        <MetricName>SINR dB</MetricName>
                        <MetricValue>{ch.metrics.sinr}</MetricValue>
                      </MetricCell>
                      <MetricCell>
                        <MetricName>RSSI dBm</MetricName>
                        <MetricValue>{ch.metrics.rssi}</MetricValue>
                      </MetricCell>
                      <MetricCell>
                        <MetricName>RSRP dBW/m²</MetricName>
                        <MetricValue>{ch.metrics.rsrp}</MetricValue>
                      </MetricCell>
                    </MetricsRow>
                  )}
                </ChannelGroup>
              );
            })}
          </ChannelList>
      )}
      </DimWrap>
      {expanded && (
        <RebootRow>
          <RebootButton
            label={`${modem.name} reboot`}
            onRebootingChange={setRebooting}
            onComplete={() => onReboot?.(modem.id)}
          />
        </RebootRow>
      )}
    </PanelRoot>
  );
}
