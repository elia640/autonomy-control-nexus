import { useState } from "react";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import VideocamIcon from "@mui/icons-material/Videocam";
import { CameraWindow } from "@/components/CameraWindow";
import { CollapseButton } from "@/components/GLOBAL/CollapseButton";
import { PowerToggle } from "@/components/GLOBAL/PowerToggle";
import { QualityBar } from "@/components/GLOBAL/QualityBar";
import { parseRate, rateStatus } from "@/lib/linkStatus";
import { useToggleList } from "@/hooks/useToggleList";
import type { PlatformUnit } from "@/types/network";
import {
  AssetLabel,
  AssetModem,
  AssetRow,
  AssetToggleCell,
  AssetValue,
  CameraButton,
  CardDetails,
  CardHeader,
  CardLinkKind,
  CardMetaRow,
  CardRoot,
  CardSection,
  CardTitle,
  RateText,
  LockRow,
  LockState,
  NestedList,
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
            <RateText status={rateStatus(parseRate(unit.mbps))}>{unit.mbps} Mbps</RateText>
            <span>{unit.lat}</span>
          </CardMetaRow>

          {unit.sims && (
            <NestedList>
              {unit.sims.map((sim, index) => (
                <AssetRow key={sim.label}>
                  <AssetLabel>{sim.label}</AssetLabel>
                  <QualityBar
                    value={sims.isOn(index) ? sim.quality : 0}
                    disabled={!sims.isOn(index)}
                    ariaLabel={`${unit.label} ${sim.label} quality`}
                  />
                  <AssetValue>{sims.isOn(index) ? `${sim.quality}%` : "OFF"}</AssetValue>
                  <AssetToggleCell>
                    <PowerToggle
                      checked={sims.isOn(index)}
                      onChange={(value) => sims.set(index, value)}
                      label={`${unit.label} ${sim.label}`}
                    />
                  </AssetToggleCell>
                </AssetRow>
              ))}
            </NestedList>
          )}

          {unit.sat && (
            <NestedList>
              <AssetRow>
                <AssetLabel>SATCOM</AssetLabel>
                <LockRow>
                  {unit.sat.locked ? <LockIcon color="success" /> : <LockOpenIcon color="error" />}
                  <LockState locked={unit.sat.locked}>
                    {unit.sat.locked ? "LOCKED" : "NO LOCK"}
                  </LockState>
                </LockRow>
                <AssetValue>
                  {satcomOn && unit.sat.connected ? "CONN" : "DISC"}
                </AssetValue>
                <AssetToggleCell>
                  <PowerToggle
                    checked={satcomOn}
                    onChange={setSatcomOn}
                    label={`${unit.label} SATCOM`}
                  />
                </AssetToggleCell>
              </AssetRow>
            </NestedList>
          )}

          {unit.extraLinks && (
            <NestedList>
              {unit.extraLinks.map((link, index) => (
                <AssetRow key={link.modem}>
                  <AssetLabel>{link.kind}</AssetLabel>
                  <QualityBar
                    value={extras.isOn(index) ? link.quality : 0}
                    disabled={!extras.isOn(index)}
                    ariaLabel={`${unit.label} ${link.modem} quality`}
                  />
                  <AssetValue status={extras.isOn(index) ? rateStatus(parseRate(link.mbps)) : "good"}>
                    {link.mbps} Mb
                  </AssetValue>
                  <AssetToggleCell>
                    <PowerToggle
                      checked={extras.isOn(index)}
                      onChange={(value) => extras.set(index, value)}
                      label={`${unit.label} ${link.modem}`}
                    />
                  </AssetToggleCell>
                  <AssetModem>{link.modem}</AssetModem>
                </AssetRow>
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
