import { useState } from "react";
import CellIcon from "@mui/icons-material/SignalCellularAlt";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import RadioIcon from "@mui/icons-material/SettingsInputAntenna";
import SatelliteIcon from "@mui/icons-material/SatelliteAlt";
import VideocamIcon from "@mui/icons-material/Videocam";
import { CameraWindow } from "@/components/CameraWindow";
import { CollapseButton } from "@/components/GLOBAL/CollapseButton";
import { HealthMetrics } from "@/components/GLOBAL/HealthMetrics";
import { PowerToggle } from "@/components/GLOBAL/PowerToggle";
import { QualityBar } from "@/components/GLOBAL/QualityBar";
import { parseRate, rateStatus } from "@/lib/linkStatus";
import { useToggleList } from "@/hooks/useToggleList";
import type { LinkKind, PlatformUnit } from "@/types/network";
import {
  AssetLabel,
  AssetRow,
  AssetToggleCell,
  AssetValue,
  CameraButton,
  CardDetails,
  CardHeader,
  CardMetaRow,
  CardRoot,
  CardSection,
  CardTitle,
  KindBadge,
  KindBadges,
  LockRow,
  LockState,
  MetricCell,
  MetricGrid,
  MetricName,
  MetricValue,
  ModemGroup,
  ModemHeaderRow,
  ModemKind,
  ModemName,
  ModemSpacer,
  NestedList,
  RateText,
  type PlatformCardVariant,
} from "./PlatformCard.styles";

export interface PlatformCardProps {
  unit: PlatformUnit;
  /** "overlay" sits on the map, "topology" is used by the logical view. */
  variant?: PlatformCardVariant;
  /** Allows the operator to collapse the details section. */
  collapsible?: boolean;
  /** Relays have no camera feed. */
  camera?: boolean;
}

const KIND_ICON: Record<LinkKind, JSX.Element> = {
  CELLULAR: <CellIcon />,
  SATCOM: <SatelliteIcon />,
  RADIO: <RadioIcon />,
};

export function PlatformCard({
  unit,
  variant = "overlay",
  collapsible = false,
  camera = true,
}: PlatformCardProps) {
  const [expanded, setExpanded] = useState(collapsible ? !!unit.defaultExpanded : true);
  const sims = useToggleList(unit.sims?.length ?? 0);
  const [cellularOn, setCellularOn] = useState(true);
  const [simsExpanded, setSimsExpanded] = useState(true);
  const [satcomOn, setSatcomOn] = useState(true);
  const [radioOn, setRadioOn] = useState(true);
  const [cameraOpen, setCameraOpen] = useState(false);

  const activeKinds: LinkKind[] = unit.activeLinks ?? [unit.link];

  return (
    <CardRoot variant={variant} status={unit.status}>
      <CardHeader>
        {collapsible && (
          <CollapseButton
            expanded={expanded}
            onToggle={() => setExpanded((value) => !value)}
            label={`${unit.label} details`}
          />
        )}
        <CardTitle>{unit.label}</CardTitle>
        <KindBadges>
          {activeKinds.map((kind) => (
            <KindBadge key={kind} status={unit.status}>
              {KIND_ICON[kind]} {kind}
            </KindBadge>
          ))}
        </KindBadges>
      </CardHeader>

      <CardSection>
        <QualityBar value={unit.quality} ariaLabel={`${unit.label} link quality`} />
      </CardSection>

      {expanded && (
        <CardDetails>
          <CardMetaRow>
            <RateText status={rateStatus(parseRate(unit.mbps))}>{unit.mbps} Mbps</RateText>
            <span>{unit.lat}</span>
          </CardMetaRow>

          {unit.cellularModem && (
            <ModemGroup>
              <ModemHeaderRow>
                {unit.sims && unit.sims.length > 0 && (
                  <CollapseButton
                    expanded={simsExpanded}
                    onToggle={() => setSimsExpanded((value) => !value)}
                    label={`${unit.label} SIM cards`}
                  />
                )}
                <ModemKind>CELLULAR</ModemKind>
                <ModemName>{unit.cellularModem.name}</ModemName>
                <ModemSpacer />
                <PowerToggle
                  checked={cellularOn}
                  onChange={setCellularOn}
                  label={`${unit.label} cellular modem`}
                />
              </ModemHeaderRow>
              <HealthMetrics
                dense
                temperature={unit.cellularModem.temperature}
                {...(unit.cellularModem.cpu !== undefined ? { cpu: unit.cellularModem.cpu } : {})}
                voltage={unit.cellularModem.voltage}
              />

              {simsExpanded && unit.sims && (
                <NestedList>
                  {unit.sims.map((sim, index) => {
                    const on = cellularOn && sims.isOn(index);
                    return (
                      <AssetRow key={sim.label}>
                        <AssetLabel>{sim.label}</AssetLabel>
                        <QualityBar
                          value={on ? sim.quality : 0}
                          disabled={!on}
                          ariaLabel={`${unit.label} ${sim.label} quality`}
                        />
                        <AssetValue>{on ? `${sim.quality}%` : "OFF"}</AssetValue>
                        <AssetToggleCell>
                          <PowerToggle
                            checked={sims.isOn(index)}
                            disabled={!cellularOn}
                            onChange={(value) => sims.set(index, value)}
                            label={`${unit.label} ${sim.label}`}
                          />
                        </AssetToggleCell>
                      </AssetRow>
                    );
                  })}
                </NestedList>
              )}
            </ModemGroup>
          )}

          {unit.sat && unit.satModem && (
            <ModemGroup>
              <ModemHeaderRow>
                <ModemKind>SATCOM</ModemKind>
                <ModemName>{unit.satModem.name}</ModemName>
                <ModemSpacer />
                <LockRow>
                  {unit.sat.locked ? <LockIcon color="success" /> : <LockOpenIcon color="error" />}
                  <LockState locked={unit.sat.locked}>
                    {unit.sat.locked ? "LOCKED" : "NO LOCK"}
                  </LockState>
                </LockRow>
                <PowerToggle
                  checked={satcomOn}
                  onChange={setSatcomOn}
                  label={`${unit.label} satellite modem`}
                />
              </ModemHeaderRow>
              <HealthMetrics
                dense
                temperature={unit.satModem.temperature}
                {...(unit.satModem.cpu !== undefined ? { cpu: unit.satModem.cpu } : {})}
                voltage={unit.satModem.voltage}
              />
              {unit.sat.metrics && (
                <MetricGrid>
                  <MetricCell>
                    <MetricName>SINR dB</MetricName>
                    <MetricValue>{unit.sat.metrics.sinr}</MetricValue>
                  </MetricCell>
                  <MetricCell>
                    <MetricName>RSRP dBW/m²</MetricName>
                    <MetricValue>{unit.sat.metrics.rsrp}</MetricValue>
                  </MetricCell>
                  <MetricCell>
                    <MetricName>RSSI dBm</MetricName>
                    <MetricValue>{unit.sat.metrics.rssi}</MetricValue>
                  </MetricCell>
                </MetricGrid>
              )}
              <AssetRow>
                <AssetLabel>LINK</AssetLabel>
                <QualityBar
                  value={satcomOn && unit.sat.connected ? unit.quality : 0}
                  disabled={!satcomOn}
                  ariaLabel={`${unit.label} satellite quality`}
                />
                <AssetValue>{satcomOn && unit.sat.connected ? "CONN" : "DISC"}</AssetValue>
                <AssetToggleCell />
              </AssetRow>
            </ModemGroup>
          )}

          {unit.radioModem && (
            <ModemGroup>
              <ModemHeaderRow>
                <ModemKind>RADIO</ModemKind>
                <ModemName>{unit.radioModem.name}</ModemName>
                <ModemSpacer />
                <PowerToggle
                  checked={radioOn}
                  onChange={setRadioOn}
                  label={`${unit.label} radio modem`}
                />
              </ModemHeaderRow>
              <HealthMetrics
                dense
                temperature={unit.radioModem.temperature}
                voltage={unit.radioModem.voltage}
              />
              {unit.radio && (
                <AssetRow>
                  <AssetLabel>LINK</AssetLabel>
                  <QualityBar
                    value={radioOn ? unit.radio.quality : 0}
                    disabled={!radioOn}
                    ariaLabel={`${unit.label} radio quality`}
                  />
                  <AssetValue status={rateStatus(parseRate(unit.radio.mbps))}>
                    {radioOn ? `${unit.radio.mbps} Mb` : "OFF"}
                  </AssetValue>
                  <AssetToggleCell />
                </AssetRow>
              )}
            </ModemGroup>
          )}

          {camera && (
            <>
              <CameraButton onClick={() => setCameraOpen(true)} aria-label={`${unit.label} camera`}>
                <VideocamIcon /> CAMERA
              </CameraButton>
              <CameraWindow
                title={unit.label}
                open={cameraOpen}
                onClose={() => setCameraOpen(false)}
              />
            </>
          )}
        </CardDetails>
      )}
    </CardRoot>
  );
}
