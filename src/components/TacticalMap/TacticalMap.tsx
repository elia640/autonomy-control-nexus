import { useCallback, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import HubIcon from "@mui/icons-material/Hub";
import RadioIcon from "@mui/icons-material/SettingsInputAntenna";
import SatelliteIcon from "@mui/icons-material/SatelliteAlt";
import TruckIcon from "@mui/icons-material/LocalShipping";
import mapImage from "@/assets/map-satellite.jpg";
import { PlatformCard } from "@/components/PlatformCard";
import {
  GROUND_STATION_POSITION,
  SATELLITE_POSITION,
  findPlatform,
  platforms,
  radioLinks,
  relays,
} from "@/data/network";
import type { LinkStatus } from "@/types/network";
import { curveMidpoint, curvePath } from "./mapGeometry";
import {
  AnchoredPoint,
  InfoChip,
  LegendBox,
  LegendRow,
  LegendSwatch,
  MapImage,
  MapRoot,
  MarkerColumn,
  MeshChip,
  NodeBadge,
  DraggableNode,
  NodeLabel,
  OverlayLayer,
  OverlaySvg,
  PingRing,
  ScaleBar,
  ScaleBox,
} from "./TacticalMap.styles";

export interface TacticalMapProps {
  /** Hides every connectivity line when false. */
  linksOn: boolean;
  coordinates?: string;
  scaleLabel?: string;
}

const MESH_BOW = -0.22;
const UPLINK_BOW = 0.12;

export function TacticalMap({
  linksOn,
  coordinates = "N 31°46.2' E 035°13.7'",
  scaleLabel = "500 m",
}: TacticalMapProps) {
  const theme = useTheme();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const relay = relays[0]!;
  const [relayPos, setRelayPos] = useState({ x: relay.x, y: relay.y });
  const [dragging, setDragging] = useState(false);

  const moveRelay = useCallback((clientX: number, clientY: number) => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(2, Math.min(98, ((clientY - rect.top) / rect.height) * 100));
    setRelayPos({ x, y });
  }, []);

  const color = (status: LinkStatus) => theme.palette.status[status];

  return (
    <MapRoot ref={rootRef}>
      <MapImage
        src={mapImage}
        alt="Satellite map of the operating area with vehicle positions"
        width={1280}
        height={960}
      />

      <OverlayLayer>
        <OverlaySvg viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="tactical-grid" width="6.25" height="6.25" patternUnits="userSpaceOnUse">
              <path
                d="M 6.25 0 L 0 0 0 6.25"
                fill="none"
                stroke={theme.palette.divider}
                strokeWidth="0.08"
                opacity="0.5"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#tactical-grid)" />

          {linksOn && (
            <g>
              {platforms.map((unit) => {
                const path = curvePath(GROUND_STATION_POSITION, unit, UPLINK_BOW);
                return (
                  <g key={unit.id}>
                    <path
                      d={path}
                      fill="none"
                      stroke={color(unit.status)}
                      strokeWidth="0.5"
                      opacity="0.12"
                      strokeLinecap="round"
                    />
                    <path
                      d={path}
                      fill="none"
                      stroke={color(unit.status)}
                      strokeWidth="0.18"
                      opacity="0.9"
                      strokeLinecap="round"
                    />
                    <path
                      d={path}
                      fill="none"
                      stroke={color(unit.status)}
                      strokeWidth="0.32"
                      strokeDasharray="0.6 3"
                      strokeLinecap="round"
                      opacity="0.95"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from="7.2"
                        to="0"
                        dur="2.4s"
                        repeatCount="indefinite"
                      />
                    </path>
                  </g>
                );
              })}

              {radioLinks.map((link) => (
                <path
                  key={`${link.from}-${link.to}`}
                  d={curvePath(findPlatform(link.from), findPlatform(link.to), MESH_BOW)}
                  fill="none"
                  stroke={color(link.status)}
                  strokeWidth="0.14"
                  strokeDasharray="1 1.1"
                  strokeLinecap="round"
                  opacity="0.75"
                />
              ))}

              {relay.connectedTo.map((id) => (
                <line
                  key={`relay-${id}`}
                  x1={relayPos.x}
                  y1={relayPos.y}
                  x2={findPlatform(id).x}
                  y2={findPlatform(id).y}
                  stroke={color(relay.status)}
                  strokeWidth="0.16"
                  strokeDasharray="1.4 1"
                  strokeLinecap="round"
                  opacity="0.85"
                />
              ))}

              <line
                x1={GROUND_STATION_POSITION.x}
                y1={GROUND_STATION_POSITION.y}
                x2={SATELLITE_POSITION.x}
                y2={SATELLITE_POSITION.y}
                stroke={theme.palette.primary.main}
                strokeWidth="0.22"
                opacity="0.9"
              />
              <line
                x1={platforms[1]!.x}
                y1={platforms[1]!.y}
                x2={SATELLITE_POSITION.x}
                y2={SATELLITE_POSITION.y}
                stroke={theme.palette.primary.main}
                strokeWidth="0.18"
                opacity="0.7"
              />
            </g>
          )}
        </OverlaySvg>

        {linksOn &&
          radioLinks.map((link) => {
            const midpoint = curveMidpoint(
              findPlatform(link.from),
              findPlatform(link.to),
              MESH_BOW,
            );
            return (
              <MeshChip
                key={`chip-${link.from}-${link.to}`}
                chipColor={color(link.status)}
                style={{ left: `${midpoint.x}%`, top: `${midpoint.y}%` }}
              >
                RF
              </MeshChip>
            );
          })}

        <AnchoredPoint
          style={{
            left: `${GROUND_STATION_POSITION.x}%`,
            top: `${GROUND_STATION_POSITION.y}%`,
          }}
        >
          <NodeBadge shape="circle" borderColor={theme.palette.primary.main}>
            <PingRing />
            <RadioIcon />
          </NodeBadge>
          <NodeLabel>GROUND STATION</NodeLabel>
        </AnchoredPoint>

        <AnchoredPoint
          style={{ left: `${SATELLITE_POSITION.x}%`, top: `${SATELLITE_POSITION.y}%` }}
        >
          <NodeBadge shape="square" borderColor={theme.palette.primary.main}>
            <SatelliteIcon />
          </NodeBadge>
          <NodeLabel>TELS-1</NodeLabel>
        </AnchoredPoint>

        {platforms.map((unit) => (
          <AnchoredPoint key={unit.id} style={{ left: `${unit.x}%`, top: `${unit.y}%` }}>
            <MarkerColumn>
              <NodeBadge shape="square" borderColor={color(unit.status)}>
                <TruckIcon />
              </NodeBadge>
              <PlatformCard unit={unit} variant="overlay" collapsible />
            </MarkerColumn>
          </AnchoredPoint>
        ))}

        <AnchoredPoint style={{ left: `${relayPos.x}%`, top: `${relayPos.y}%` }}>
          <DraggableNode
            dragging={dragging}
            role="button"
            aria-label="Drag relay"
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              setDragging(true);
            }}
            onPointerMove={(event) => {
              if (dragging) moveRelay(event.clientX, event.clientY);
            }}
            onPointerUp={(event) => {
              event.currentTarget.releasePointerCapture(event.pointerId);
              setDragging(false);
            }}
          >
            <NodeBadge shape="circle" borderColor={color(relay.status)}>
              <HubIcon />
            </NodeBadge>
            <PlatformCard unit={relay} variant="overlay" camera={false} />
          </DraggableNode>
        </AnchoredPoint>

        <InfoChip sx={{ left: 12, top: 12 }}>
          <MyLocationIcon /> {coordinates}
        </InfoChip>

        <LegendBox>
          {(["good", "marginal", "poor"] as LinkStatus[]).map((status) => (
            <LegendRow key={status}>
              <LegendSwatch swatchColor={color(status)} />
              <span>{status} link</span>
            </LegendRow>
          ))}
          <LegendRow>
            <LegendSwatch swatchColor={theme.palette.text.secondary} dashed />
            <span>radio mesh</span>
          </LegendRow>
        </LegendBox>

        <ScaleBox>
          <ScaleBar />
          <div>{scaleLabel}</div>
        </ScaleBox>
      </OverlayLayer>
    </MapRoot>
  );
}
