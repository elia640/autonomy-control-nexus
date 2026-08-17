import { useState } from "react";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import VideocamIcon from "@mui/icons-material/Videocam";
import { CameraWindow } from "@/components/CameraWindow";
import { CollapseButton } from "@/components/GLOBAL/CollapseButton";
import { PowerToggle } from "@/components/GLOBAL/PowerToggle";
import { QualityBar } from "@/components/GLOBAL/QualityBar";
import { useToggleList } from "@/hooks/useToggleList";
import type { PlatformUnit } from "@/types/network";
import {
  CameraButton,
  CardDetails,
  CardHeader,
  CardLinkKind,
  CardMetaRow,
  CardRoot,
  CardSection,
  CardTitle,
  ConnectionState,
  ExtraKind,
  ExtraModem,
  ExtraRate,
  LockRow,
  LockState,
  NestedBar,
  NestedLabel,
  NestedList,
  NestedRow,
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

export function PlatformCard({
  unit,
  variant = "overlay",
  collapsible = false,
  camera = true,
}: PlatformCardProps) {
  const [expanded, setExpanded] = useState(collapsible ? !!unit.defaultExpanded : true);
  const sims = useToggleList(unit.sims?.length ?? 0);
  const extras = useToggleList(unit.extraLinks?.length ?? 0);
  const [satcomOn, setSatcomOn] = useState(true);
  const [cameraOpen, setCameraOpen] = useState(false);

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
        <CardLinkKind status={unit.status}>{unit.link}</CardLinkKind>
      </CardHeader>

      <CardSection>
        <QualityBar value={unit.quality} ariaLabel={`${unit.label} link quality`} />
      </CardSection>

      {expanded && (
        <CardDetails>
          <CardMetaRow>
            <span>{unit.mbps} Mbps</span>
            <span>{unit.lat}</span>
          </CardMetaRow>

          {unit.sims && (
            <NestedList>
              {unit.sims.map((sim, index) => (
                <NestedRow key={sim.label}>
                  <NestedLabel>{sim.label}</NestedLabel>
                  <NestedBar>
                    <QualityBar
                      value={sims.isOn(index) ? sim.quality : 0}
                      disabled={!sims.isOn(index)}
                      ariaLabel={`${unit.label} ${sim.label} quality`}
                    />
                  </NestedBar>
                  <PowerToggle
                    checked={sims.isOn(index)}
                    onChange={(value) => sims.set(index, value)}
                    label={`${unit.label} ${sim.label}`}
                  />
                </NestedRow>
              ))}
            </NestedList>
          )}

          {unit.sat && (
            <NestedList>
              <LockRow>
                {unit.sat.locked ? <LockIcon color="success" /> : <LockOpenIcon color="error" />}
                <LockState locked={unit.sat.locked}>
                  {unit.sat.locked ? "LOCKED" : "NO LOCK"}
                </LockState>
                <ConnectionState>
                  {satcomOn && unit.sat.connected ? "CONNECTED" : "DISCONNECTED"}
                </ConnectionState>
                <PowerToggle
                  checked={satcomOn}
                  onChange={setSatcomOn}
                  label={`${unit.label} SATCOM`}
                />
              </LockRow>
            </NestedList>
          )}

          {unit.extraLinks && (
            <NestedList>
              {unit.extraLinks.map((link, index) => (
                <NestedRow key={link.modem}>
                  <ExtraKind>{link.kind}</ExtraKind>
                  <ExtraModem>{link.modem}</ExtraModem>
                  <NestedBar>
                    <QualityBar
                      value={extras.isOn(index) ? link.quality : 0}
                      disabled={!extras.isOn(index)}
                      ariaLabel={`${unit.label} ${link.modem} quality`}
                    />
                  </NestedBar>
                  <ExtraRate>{link.mbps}</ExtraRate>
                  <PowerToggle
                    checked={extras.isOn(index)}
                    onChange={(value) => extras.set(index, value)}
                    label={`${unit.label} ${link.modem}`}
                  />
                </NestedRow>
              ))}
            </NestedList>
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
