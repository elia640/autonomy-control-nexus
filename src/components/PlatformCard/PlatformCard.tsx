import { useState, type ReactElement } from "react";
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
import { SignalBars } from "@/components/GLOBAL/SignalBars";

import { parseRate, rateStatus } from "@/lib/linkStatus";
import { useToggleList } from "@/hooks/useToggleList";
import type { LinkKind, PlatformUnit } from "@/types/network";
import { alertCountFor } from "@/data/notifications";
import { estimateLatency } from "@/lib/telemetry";
import {
  AlertBadge,
  AssetLabel,
  AssetRow,
  AssetToggleCell,
  AssetValue,
  CameraButton,
  CameraIconButton,
  CompactBody,
  CompactHeader,
  CardDetails,
  CardHeader,
  CardMetaRow,
  CardRoot,
  CardSection,
  CardTitle,
  CompactMetaRow,
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
  /** Hides the card title (used where the map marker already names the unit). */
  hideTitle?: boolean;
  /** Fixed summary card: name, ranges, quality + score and the camera control. */
  compact?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

/** "PLATFORM 3" -> "PLT 3": keeps the marker readable at minimum width. */
const shortLabel = (label: string): string =>
  label
    .split(/\s+/)
    .map((word) => (/^\d+$/.test(word) ? word : (word.replace(/[AEIOU]/gi, "") || word).slice(0, 3)))
    .join(" ");

const KIND_ICON: Record<LinkKind, ReactElement> = {
  CELLULAR: <CellIcon />,
  SATCOM: <SatelliteIcon />,
  RADIO: <RadioIcon />,
};

export function PlatformCard({
  unit,
  variant = "overlay",
  collapsible = false,
  camera = true,
  hideTitle = false,
  compact = false,
  selected = false,
  onSelect,
}: PlatformCardProps) {
  const [expanded, setExpanded] = useState(collapsible ? !!unit.defaultExpanded : true);
  const sims = useToggleList(unit.sims?.length ?? 0);
  const [cellularOn, setCellularOn] = useState(true);
  const [simsExpanded, setSimsExpanded] = useState(true);
  const [satcomOn, setSatcomOn] = useState(true);
  const [radioOn, setRadioOn] = useState(true);
  const [cameraOpen, setCameraOpen] = useState(false);

  const activeKinds: LinkKind[] = unit.activeLinks ?? [unit.link];
  // Redundancy rule: the operator must keep at least one communication range up.
  const activeCount = [
    unit.cellularModem ? cellularOn : false,
    unit.sat && unit.satModem ? satcomOn : false,
    unit.radioModem ? radioOn : false,
  ].filter(Boolean).length;
  const isLastLink = (on: boolean) => on && activeCount <= 1;
  const activeSims = sims.values.filter(Boolean).length;
  const alerts = alertCountFor(unit.label);
  const latency = estimateLatency(unit.quality);

  if (compact) {
    return (
      <CardRoot
        variant={variant}
        status={unit.status}
        selected={selected}
        dense
        clickable={!!onSelect}
        {...(onSelect ? { role: "button", onClick: onSelect } : {})}
      >
        <CompactHeader title={unit.label}>
          {!hideTitle && <CardTitle>{shortLabel(unit.label)}</CardTitle>}
          {alerts > 0 && <AlertBadge title={`${alerts} open alerts`}>{alerts}</AlertBadge>}
          <KindBadges>
            {activeKinds.map((kind) => (
              <KindBadge key={kind} title={kind}>
                {KIND_ICON[kind]} {kind.slice(0, 3)}
              </KindBadge>
            ))}
          </KindBadges>
        </CompactHeader>
        <CompactBody>
          <SignalBars value={unit.quality} bars={4} ariaLabel={`${unit.label} link quality`} />
          {camera && (
            <CameraIconButton
              onClick={(event) => {
                event.stopPropagation();
                setCameraOpen(true);
              }}
              aria-label={`${unit.label} camera`}
              title="Camera"
            >
              <VideocamIcon />
            </CameraIconButton>
          )}
        </CompactBody>
        {camera && (
          <CameraWindow title={unit.label} open={cameraOpen} onClose={() => setCameraOpen(false)} />
        )}
      </CardRoot>
    );
  }

  return (
    <CardRoot variant={variant} status={unit.status} selected={selected}>
      <CardHeader>
        {collapsible && (
          <CollapseButton
            expanded={expanded}
            onToggle={() => setExpanded((value) => !value)}
            label={`${unit.label} details`}
          />
        )}
        {!hideTitle && <CardTitle>{unit.label}</CardTitle>}
        {alerts > 0 && <AlertBadge title={`${alerts} open alerts`}>{alerts}</AlertBadge>}
        {/* Shown collapsed and expanded; neutral grey so only the bar carries colour. */}
        <KindBadges>
          {activeKinds.map((kind) => (
            <KindBadge key={kind}>
              {KIND_ICON[kind]} {kind}
            </KindBadge>
          ))}
        </KindBadges>
      </CardHeader>

      <CardSection>
        <SignalBars value={unit.quality} ariaLabel={`${unit.label} link quality`} />
      </CardSection>

      {expanded && (
        <CardDetails>
          <CardMetaRow>
            <RateText status={rateStatus(parseRate(unit.mbps))}>{unit.mbps} Mbps (RX)</RateText>
            <span>LAT {latency} ms</span>
            <span>{unit.lat}</span>
          </CardMetaRow>

          {unit.cellularModem && (
            <ModemGroup>
              <ModemHeaderRow>
                <PowerToggle
                  checked={cellularOn}
                  onChange={setCellularOn}
                  lastActive={isLastLink(cellularOn)}
                  label={`${unit.label} cellular modem`}
                />
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
                        <AssetToggleCell>
                          <PowerToggle
                            checked={sims.isOn(index)}
                            disabled={!cellularOn}
                            onChange={(value) => sims.set(index, value)}
                            lastActive={sims.isOn(index) && activeSims <= 1}
                            label={`${unit.label} ${sim.label}`}
                          />
                        </AssetToggleCell>
                        <AssetLabel>{sim.label}</AssetLabel>
                        <SignalBars
                          value={on ? sim.quality : 0}
                          disabled={!on}
                          ariaLabel={`${unit.label} ${sim.label} quality`}
                        />
                        <AssetValue>{on ? "ON" : "OFF"}</AssetValue>
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
                <PowerToggle
                  checked={satcomOn}
                  onChange={setSatcomOn}
                  lastActive={isLastLink(satcomOn)}
                  label={`${unit.label} satellite modem`}
                />
                <ModemKind>SATCOM</ModemKind>
                <ModemName>{unit.satModem.name}</ModemName>
                <ModemSpacer />
                <LockRow>
                  {unit.sat.locked ? <LockIcon color="success" /> : <LockOpenIcon color="error" />}
                  <LockState locked={unit.sat.locked}>
                    {unit.sat.locked ? "LOCKED" : "NO LOCK"}
                  </LockState>
                </LockRow>
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
                <AssetToggleCell />
                <AssetLabel>LINK</AssetLabel>
                <SignalBars
                  value={satcomOn && unit.sat.connected ? unit.quality : 0}
                  disabled={!satcomOn}
                  ariaLabel={`${unit.label} satellite quality`}
                />
                <AssetValue>{satcomOn && unit.sat.connected ? "CONN" : "DISC"}</AssetValue>
              </AssetRow>
            </ModemGroup>
          )}

          {unit.radioModem && (
            <ModemGroup>
              <ModemHeaderRow>
                <PowerToggle
                  checked={radioOn}
                  onChange={setRadioOn}
                  lastActive={isLastLink(radioOn)}
                  label={`${unit.label} radio modem`}
                />
                <ModemKind>RADIO</ModemKind>
                <ModemName>{unit.radioModem.name}</ModemName>
                <ModemSpacer />
              </ModemHeaderRow>
              <HealthMetrics
                dense
                temperature={unit.radioModem.temperature}
                voltage={unit.radioModem.voltage}
              />
              {unit.radio && (
                <AssetRow>
                  <AssetToggleCell />
                  <AssetLabel>LINK</AssetLabel>
                  <SignalBars
                    value={radioOn ? unit.radio.quality : 0}
                    disabled={!radioOn}
                    ariaLabel={`${unit.label} radio quality`}
                  />
                  <AssetValue status={rateStatus(parseRate(unit.radio.mbps))}>
                    {radioOn ? `${unit.radio.mbps} (RX)` : "OFF"}
                  </AssetValue>
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
