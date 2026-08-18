import { useState } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RadioIcon from "@mui/icons-material/SettingsInputAntenna";
import SatelliteIcon from "@mui/icons-material/SatelliteAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import { CommsAssetCard } from "@/components/CommsAssetCard";
import { CommsLinkRow } from "@/components/CommsLinkRow";
import { QualityBar } from "@/components/GLOBAL/QualityBar";
import { SectionHeader } from "@/components/GLOBAL/SectionHeader";
import { SidePanel } from "@/components/GLOBAL/SidePanel";
import { ThroughputChart } from "@/components/ThroughputChart";
import { ViewModeSwitch } from "@/components/ViewModeSwitch";
import { MAX_BANDWIDTH_MBPS, throughputSamples } from "@/data/network";
import { useToggleList } from "@/hooks/useToggleList";
import type { ViewMode } from "@/types/network";
import {
  AssetStack,
  HealthCaption,
  HealthScale,
  PanelFooter,
  PanelHeader,
  PanelTitle,
  PrecheckBar,
  PrecheckLabel,
  RunButton,
  SectionBody,
  SettingsButton,
} from "./ControlRoomPanel.styles";

const SIM_CARDS = [
  { label: "SIM 1", quality: 72, rate: "12.5 Mbps" },
  { label: "SIM 2", quality: 64, rate: "12.5 Mbps" },
  { label: "SIM 3", quality: 81, rate: "12.5 Mbps" },
];

const OVERALL_QUALITY = 78;

export interface ControlRoomPanelProps {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  onRunPrecheck?: () => void;
  onOpenSettings?: () => void;
}

export function ControlRoomPanel({
  mode,
  onModeChange,
  onRunPrecheck,
  onOpenSettings,
}: ControlRoomPanelProps) {
  const [modemOn, setModemOn] = useState(true);
  const [satOn, setSatOn] = useState(true);
  const [radioOn, setRadioOn] = useState(true);
  const [simsExpanded, setSimsExpanded] = useState(true);
  const [satExpanded, setSatExpanded] = useState(true);
  const [radioExpanded, setRadioExpanded] = useState(true);
  const sims = useToggleList(SIM_CARDS.length);

  return (
    <SidePanel
      side="right"
      header={
        <PanelHeader>
          <PanelTitle component="h1">CONTROL ROOM</PanelTitle>
          <PrecheckBar>
            <PrecheckLabel>PRECHECK</PrecheckLabel>
            <RunButton
              variant="contained"
              size="small"
              startIcon={<PlayArrowIcon />}
              onClick={onRunPrecheck}
            >
              Run
            </RunButton>
          </PrecheckBar>
        </PanelHeader>
      }
      footer={
        <PanelFooter>
          <ViewModeSwitch mode={mode} onModeChange={onModeChange} />
          <SettingsButton
            variant="outlined"
            size="small"
            startIcon={<SettingsIcon />}
            onClick={onOpenSettings}
          >
            Settings
          </SettingsButton>
        </PanelFooter>
      }
    >
      <SectionHeader title="Network Health" />
      <SectionBody>
        <HealthCaption>Overall link quality</HealthCaption>
        <QualityBar value={OVERALL_QUALITY} ariaLabel="Overall link quality" />
        <HealthScale>
          <span>Poor</span>
          <span>Marginal</span>
          <span>Good</span>
        </HealthScale>
      </SectionBody>

      <SectionHeader title="Communication Assets" />
      <AssetStack>
        <CommsAssetCard
          name="MODEM CM-4200"
          icon={<RadioIcon />}
          enabled={modemOn}
          onEnabledChange={setModemOn}
          statusLabel={modemOn ? "OPERATIONAL" : "OFF"}
          statusTone={modemOn ? "good" : "poor"}
          temperature={47}
          cpuUsage={38}
          voltage={12.4}
          expanded={simsExpanded}
          onExpandedChange={setSimsExpanded}
        >
          {SIM_CARDS.map((sim, index) => (
            <CommsLinkRow
              key={sim.label}
              label={sim.label}
              quality={sim.quality}
              rate={sim.rate}
              enabled={modemOn && sims.isOn(index)}
              onEnabledChange={(value) => sims.set(index, value)}
            />
          ))}
        </CommsAssetCard>

        <CommsAssetCard
          name="SATCOM MDM-9"
          icon={<SatelliteIcon />}
          enabled={satOn}
          onEnabledChange={setSatOn}
          statusLabel={satOn ? "SAT LOCKED" : "NO LOCK"}
          statusTone={satOn ? "good" : "poor"}
          temperature={52}
          cpuUsage={24}
          voltage={12.6}
        />

        <CommsAssetCard
          name="RADIO VHF-7"
          icon={<RadioIcon />}
          enabled={radioOn}
          onEnabledChange={setRadioOn}
          statusLabel={radioOn ? "OPERATIONAL" : "OFF"}
          statusTone={radioOn ? "good" : "poor"}
          temperature={41}
          voltage={12.1}
          expanded={radioExpanded}
          onExpandedChange={setRadioExpanded}
        >
          <CommsLinkRow
            label="RADIO"
            quality={58}
            rate="4.8 Mbps"
            enabled={radioOn}
            onEnabledChange={setRadioOn}
          />
        </CommsAssetCard>
      </AssetStack>

      <SectionHeader title="Performance Monitoring" />
      <ThroughputChart samples={throughputSamples} maxBandwidth={MAX_BANDWIDTH_MBPS} />
    </SidePanel>
  );
}
