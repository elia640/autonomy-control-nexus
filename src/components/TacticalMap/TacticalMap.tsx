import { useRef } from "react";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import HubIcon from "@mui/icons-material/Hub";
import RadioIcon from "@mui/icons-material/SettingsInputAntenna";
import SatelliteIcon from "@mui/icons-material/SatelliteAlt";
import CellIcon from "@mui/icons-material/SignalCellularAlt";
import TruckIcon from "@mui/icons-material/LocalShipping";
import mapImage from "@/assets/map-satellite.jpg";
import { PlatformCard } from "@/components/PlatformCard";
import { useMapDrag } from "@/hooks/useMapDrag";
import {
  GROUND_STATION_POSITION,
  SATELLITE_POSITION,
  findPlatform,
  platforms,
  radioLinks,
  relays,
} from "@/data/network";
import type { LinkKind, LinkStatus, PlatformUnit, RelayUnit } from "@/types/network";
import { curvePath, formatCoordinates } from "./mapGeometry";
import {
  AnchoredPoint,
  DualLinkChip,
  DualLinkRow,
  InfoChip,
  LegendBox,
  LegendRow,
  LegendSwatch,
  MapImage,
  MapRoot,
  MarkerColumn,
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

const UPLINK_BOW = 0.12;
const MESH_BOW = -0.22;

const kindsOf = (unit: PlatformUnit | RelayUnit): LinkKind[] => unit.activeLinks ?? [unit.link];
const hasRadio = (unit: PlatformUnit | RelayUnit): boolean => kindsOf(unit).includes("RADIO");

const KIND_ICON: Record<LinkKind, typeof RadioIcon> = {
  CELLULAR: CellIcon,
  SATCOM: SatelliteIcon,
  RADIO: RadioIcon,
};

export function TacticalMap({
  linksOn,
  coordinates = "N 31°46.2' E 035°13.7'",
  scaleLabel = "500 m",
}: TacticalMapProps) {
  const theme = useTheme();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const relay = relays[0]!;
  const relayDrag = useMapDrag(rootRef, { x: relay.x, y: relay.y });
  const stationDrag = useMapDrag(rootRef, GROUND_STATION_POSITION);

  const color = (status: LinkStatus) => theme.palette.status[status];
  const radioPlatforms = platforms.filter(hasRadio);

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
              {/* Radio-only connectivity: platform ↔ ground station */}
              {radioPlatforms.map((unit) => (
                <line
                  key={`gs-${unit.id}`}
                  x1={stationDrag.position.x}
                  y1={stationDrag.position.y}
                  x2={unit.x}
                  y2={unit.y}
                  stroke={color(unit.status)}
                  strokeWidth="0.22"
                  strokeDasharray="1.2 1.2"
                  strokeLinecap="round"
                  opacity="0.95"
                />
              ))}

              {/* Radio-only connectivity: platform ↔ platform */}
              {radioLinks
                .filter(
                  (link) => hasRadio(findPlatform(link.from)) && hasRadio(findPlatform(link.to)),
                )
                .map((link) => (
                  <line
                    key={`${link.from}-${link.to}`}
                    x1={findPlatform(link.from).x}
                    y1={findPlatform(link.from).y}
                    x2={findPlatform(link.to).x}
                    y2={findPlatform(link.to).y}
                    stroke={color(link.status)}
                    strokeWidth="0.2"
                    strokeDasharray="1.2 1.2"
                    strokeLinecap="round"
                    opacity="0.9"
                  />
                ))}

              {/* Radio-only connectivity: relay ↔ platform */}
              {relay.connectedTo
                .filter((id) => hasRadio(findPlatform(id)))
                .map((id) => (
                  <line
                    key={`relay-${id}`}
                    x1={relayDrag.position.x}
                    y1={relayDrag.position.y}
                    x2={findPlatform(id).x}
                    y2={findPlatform(id).y}
                    stroke={color(relay.status)}
                    strokeWidth="0.2"
                    strokeDasharray="1.2 1.2"
                    strokeLinecap="round"
                    opacity="0.9"
                  />
                ))}
            </g>
          )}
        </OverlaySvg>

        <AnchoredPoint
          style={{
            left: `${stationDrag.position.x}%`,
            top: `${stationDrag.position.y}%`,
          }}
        >
          <Tooltip title={formatCoordinates(stationDrag.position)} arrow placement="top">
            <DraggableNode
              dragging={stationDrag.dragging}
              role="button"
              aria-label="Drag ground station"
              {...stationDrag.handlers}
            >
              <NodeBadge shape="circle" borderColor={theme.palette.primary.main}>
                <PingRing />
                <RadioIcon />
              </NodeBadge>
              <NodeLabel>GROUND STATION</NodeLabel>
            </DraggableNode>
          </Tooltip>
        </AnchoredPoint>

        <AnchoredPoint
          style={{ left: `${SATELLITE_POSITION.x}%`, top: `${SATELLITE_POSITION.y}%` }}
        >
          <NodeBadge shape="square" borderColor={theme.palette.primary.main}>
            <SatelliteIcon />
          </NodeBadge>
          <NodeLabel>TELS-1</NodeLabel>
        </AnchoredPoint>

        {platforms.map((unit) => {
          const kinds = kindsOf(unit);
          return (
            <AnchoredPoint key={unit.id} style={{ left: `${unit.x}%`, top: `${unit.y}%` }}>
              <MarkerColumn>
                <NodeBadge shape="square" borderColor={color(unit.status)}>
                  <TruckIcon />
                </NodeBadge>
                {kinds.length > 1 && (
                  <DualLinkRow aria-label={`${unit.label} simultaneous links`}>
                    {kinds.map((kind) => {
                      const Icon = KIND_ICON[kind];
                      return (
                        <DualLinkChip key={kind} chipColor={color(unit.status)}>
                          <Icon /> {kind.slice(0, 3)}
                        </DualLinkChip>
                      );
                    })}
                  </DualLinkRow>
                )}
                <PlatformCard unit={unit} variant="overlay" collapsible />
              </MarkerColumn>
            </AnchoredPoint>
          );
        })}

        <AnchoredPoint
          style={{ left: `${relayDrag.position.x}%`, top: `${relayDrag.position.y}%` }}
        >
          <Tooltip title={formatCoordinates(relayDrag.position)} arrow placement="top">
            <DraggableNode
              dragging={relayDrag.dragging}
              role="button"
              aria-label="Drag relay"
              {...relayDrag.handlers}
            >
              <NodeBadge shape="circle" borderColor={color(relay.status)}>
                <HubIcon />
              </NodeBadge>
              <PlatformCard unit={relay} variant="overlay" camera={false} collapsible />
            </DraggableNode>
          </Tooltip>
        </AnchoredPoint>

        <InfoChip sx={{ left: 12, top: 12 }}>
          <MyLocationIcon /> {coordinates}
        </InfoChip>

        <LegendBox>
          {(["good", "marginal", "poor"] as LinkStatus[]).map((status) => (
            <LegendRow key={status}>
              <LegendSwatch swatchColor={color(status)} dashed />
              <span>{status} radio link</span>
            </LegendRow>
          ))}
          <LegendRow>
            <span>radio connectivity only</span>
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
