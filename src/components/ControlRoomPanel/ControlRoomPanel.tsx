import { useMemo, useState } from "react";
import HubIcon from "@mui/icons-material/Hub";
import SettingsIcon from "@mui/icons-material/Settings";
import { SectionHeader } from "@/components/GLOBAL/SectionHeader";
import { SeriesCheckbox } from "@/components/GLOBAL/SeriesCheckbox";
import { SidePanel } from "@/components/GLOBAL/SidePanel";
import { ModemCompareWindow } from "@/components/ModemCompareWindow";
import { ModemPanel } from "@/components/ModemPanel";
import { MonitoringGraph } from "@/components/MonitoringGraph";
import { RadioPanel } from "@/components/RadioPanel";
import { SettingsDialog } from "@/components/SettingsDialog";
import { ViewModeSwitch } from "@/components/ViewModeSwitch";
import {
  controlRoomModem,
  controlRoomRadio,
  monitoringSamples,
  vehicleModem,
  vehicleRadio,
} from "@/data/modems";
import { MAX_BANDWIDTH_MBPS, platforms } from "@/data/network";
import { useTheme } from "@mui/material/styles";
import type { ViewMode } from "@/types/network";
import {
  CompareCaption,
  CompareRow,
  ControlRoomButton,
  FooterRow,
  FooterSpacer,
  PanelFooter,
  PanelStack,
  SettingsButton,
} from "./ControlRoomPanel.styles";

export interface ControlRoomPanelProps {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  /** Platform id shown in the panel; null shows the control room itself. */
  selectedVehicleId: string | null;
  onSelectVehicle: (id: string | null) => void;
  onRunPrecheck?: () => void;
}

export function ControlRoomPanel({
  mode,
  onModeChange,
  selectedVehicleId,
  onSelectVehicle,
  onRunPrecheck,
}: ControlRoomPanelProps) {
  const theme = useTheme();
  const [modemExpanded, setModemExpanded] = useState(false);
  const [radioExpanded, setRadioExpanded] = useState(false);
  const [radioOn, setRadioOn] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [radioFrequency, setRadioFrequency] = useState(2412);
  const [compared, setCompared] = useState<string[]>([]);

  const vehicle = selectedVehicleId
    ? (platforms.find((p) => p.id === selectedVehicleId) ?? null)
    : null;

  const modem = useMemo(
    () => (vehicle ? vehicleModem(vehicle.id) : controlRoomModem),
    [vehicle],
  );
  const radio = useMemo(() => (vehicle ? vehicleRadio(vehicle.id) : controlRoomRadio), [vehicle]);
  const samples = useMemo(
    () => monitoringSamples(vehicle ? vehicle.label.length + vehicle.quality / 10 : 0),
    [vehicle],
  );

  const title = vehicle ? vehicle.label : "CONTROL ROOM";

  const compareOptions = [
    { id: "cr-modem", label: controlRoomModem.name },
    ...platforms.map((p) => ({ id: p.id, label: `${p.label} · J8` })),
  ];

  const toggleCompare = (id: string, checked: boolean) =>
    setCompared((prev) => (checked ? [...prev, id] : prev.filter((item) => item !== id)));

  return (
    <SidePanel
      side="right"
      width={340}
      footer={
        <PanelFooter>
          <FooterRow>
            <ViewModeSwitch mode={mode} onModeChange={onModeChange} />
          </FooterRow>
          <ControlRoomButton
            variant="outlined"
            size="small"
            active={vehicle === null}
            startIcon={<HubIcon />}
            onClick={() => onSelectVehicle(null)}
          >
            Control Room
          </ControlRoomButton>
          <FooterSpacer />
          <SettingsButton
            variant="outlined"
            size="small"
            startIcon={<SettingsIcon />}
            onClick={() => setSettingsOpen(true)}
          >
            Settings
          </SettingsButton>
        </PanelFooter>
      }
    >
      <SectionHeader title={title} emphasis />

      <PanelStack>
        <ModemPanel
          modem={modem}
          expanded={modemExpanded}
          onExpandedChange={setModemExpanded}
        />
        <RadioPanel
          radio={radio}
          expanded={radioExpanded}
          onExpandedChange={setRadioExpanded}
          enabled={radioOn}
          onEnabledChange={setRadioOn}
          lastActive={false}
        />
      </PanelStack>

      <SectionHeader title={vehicle ? "Halo Monitoring" : "Control Room Monitoring"} />
      <MonitoringGraph
        samples={samples}
        maxBandwidth={MAX_BANDWIDTH_MBPS}
        withLatency={vehicle !== null}
      />

      {vehicle === null && (
        <>
          <CompareCaption>COMPARE HALO MONITORING</CompareCaption>
          <CompareRow>
            {compareOptions.map((option) => (
              <SeriesCheckbox
                key={option.id}
                label={option.label}
                color={theme.palette.primary.main}
                checked={compared.includes(option.id)}
                onChange={(checked) => toggleCompare(option.id, checked)}
              />
            ))}
          </CompareRow>
        </>
      )}


      {compared.map((id, index) => {
        const option = compareOptions.find((o) => o.id === id);
        const isControlRoom = id === "cr-modem";
        return (
          <ModemCompareWindow
            key={id}
            title={option?.label ?? id}
            samples={
              isControlRoom
                ? monitoringSamples(0)
                : monitoringSamples(
                    (platforms.find((p) => p.id === id)?.quality ?? 50) / 10 +
                      (platforms.find((p) => p.id === id)?.label.length ?? 0),
                  )
            }
            initial={{ x: 120 + index * 32, y: 120 + index * 32 }}
            onClose={() => toggleCompare(id, false)}
          />
        );
      })}

      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        radioFrequency={radioFrequency}
        onRadioFrequencyChange={setRadioFrequency}
        onRunPrecheck={onRunPrecheck}
      />
    </SidePanel>
  );
}
