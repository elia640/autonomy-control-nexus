import { useEffect, useMemo, useRef, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CenterIcon from "@mui/icons-material/CenterFocusStrong";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import NavigationIcon from "@mui/icons-material/Navigation";
import HubIcon from "@mui/icons-material/Hub";
import RadioIcon from "@mui/icons-material/SettingsInputAntenna";
import SatelliteIcon from "@mui/icons-material/SatelliteAlt";

import TruckIcon from "@mui/icons-material/LocalShipping";
import mapImage from "@/assets/map-satellite.jpg";
import { CoordinateDialog } from "@/components/CoordinateDialog";
import { PlatformCard } from "@/components/PlatformCard";
import { useMapDrag } from "@/hooks/useMapDrag";
import { useMapViewport } from "@/hooks/useMapViewport";
import {
  GROUND_STATION_POSITION,
  SATELLITE_POSITION,
  findPlatform,
  platforms,
  radioLinks,
  relays,
} from "@/data/network";
import type { LinkKind, LinkStatus, PlatformUnit, RelayUnit } from "@/types/network";
import { formatCoordinates } from "./mapGeometry";
import {
  AnchoredPoint,
  InfoChip,
  LegendBox,
  LegendRow,
  LegendSwatch,
  MapCanvas,
  MapImage,
  MapRoot,
  OffscreenArrow,
  ZoomButton,
  ZoomControls,
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
  /** Platform currently shown in the right-hand panel. */
  selectedVehicleId?: string | null;
  onSelectVehicle?: (id: string | null) => void;
  /** Relay focused from the sidebar; centres the map on it. */
  selectedRelayId?: string | null;
  onSelectRelay?: (id: string | null) => void;
}

const kindsOf = (unit: PlatformUnit | RelayUnit): LinkKind[] => unit.activeLinks ?? [unit.link];
const hasRadio = (unit: PlatformUnit | RelayUnit): boolean => kindsOf(unit).includes("RADIO");


export function TacticalMap({
  linksOn,
  coordinates = "N 31°46.2' E 035°13.7'",
  scaleLabel = "500 m",
  selectedVehicleId = null,
  onSelectVehicle,
  selectedRelayId = null,
  onSelectRelay,
}: TacticalMapProps) {
  const theme = useTheme();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const { viewport, panning, zoomBy, reset, centerOn, handlers } = useMapViewport(rootRef);
  const relay = relays[0]!;
  const relayDrag = useMapDrag(canvasRef, { x: relay.x, y: relay.y });
  const stationDrag = useMapDrag(canvasRef, GROUND_STATION_POSITION);
  // Selecting a platform recentres the map on it.
  useEffect(() => {
    if (!selectedVehicleId) return;
    const unit = platforms.find((item) => item.id === selectedVehicleId);
    if (unit) centerOn(unit.x, unit.y);
  }, [selectedVehicleId, centerOn]);

  // Selecting a relay in the sidebar recentres the map on its marker.
  const relayPosition = relayDrag.position;
  useEffect(() => {
    if (selectedRelayId !== relay.id) return;
    centerOn(relayPosition.x, relayPosition.y);
    // Only re-centre when the selection changes, not while dragging.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRelayId, relay.id, centerOn]);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [coordTarget, setCoordTarget] = useState<null | "relay" | "station">(null);
  const [stationOffscreen, setStationOffscreen] = useState<
    { angle: number; left: number; top: number } | null
  >(null);

  // Command post direction vector, shown when the station is panned off the map.
  useEffect(() => {
    const update = () => {
      const root = rootRef.current?.getBoundingClientRect();
      const canvas = canvasRef.current?.getBoundingClientRect();
      if (!root || !canvas) return;
      const sx = canvas.left + (stationDrag.position.x / 100) * canvas.width;
      const sy = canvas.top + (stationDrag.position.y / 100) * canvas.height;
      const inside = sx >= root.left && sx <= root.right && sy >= root.top && sy <= root.bottom;
      if (inside) {
        setStationOffscreen(null);
        return;
      }
      const cx = root.left + root.width / 2;
      const cy = root.top + root.height / 2;
      const dx = sx - cx;
      const dy = sy - cy;
      const margin = 44;
      const halfW = Math.max(root.width / 2 - margin, 10);
      const halfH = Math.max(root.height / 2 - margin, 10);
      // Project the direction vector onto the visible map border.
      const t = Math.min(
        Math.abs(dx) > 0.001 ? halfW / Math.abs(dx) : Infinity,
        Math.abs(dy) > 0.001 ? halfH / Math.abs(dy) : Infinity,
      );
      const scale = Number.isFinite(t) ? t : 0;
      setStationOffscreen({
        angle: (Math.atan2(dy, dx) * 180) / Math.PI,
        left: root.width / 2 + dx * scale,
        top: root.height / 2 + dy * scale,
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [stationDrag.position.x, stationDrag.position.y, viewport.x, viewport.y, viewport.zoom]);

  // Markers sitting on top of each other are fanned out so each stays readable.
  const stackOffsets = useMemo(() => {
    const groups: PlatformUnit[][] = [];
    platforms.forEach((unit) => {
      const group = groups.find((members) =>
        members.some((other) => Math.abs(other.x - unit.x) < 7 && Math.abs(other.y - unit.y) < 9),
      );
      if (group) group.push(unit);
      else groups.push([unit]);
    });
    const offsets: Record<string, { dx: number; dy: number; stacked: boolean }> = {};
    groups.forEach((members) =>
      members.forEach((unit, index) => {
        offsets[unit.id] = {
          dx: (index - (members.length - 1) / 2) * 52,
          dy: index * 16,
          stacked: members.length > 1,
        };
      }),
    );
    return offsets;
  }, []);

  const color = (status: LinkStatus) => theme.palette.status[status];
  const radioPlatforms = platforms.filter(hasRadio);
  // With links off, hovering a vehicle reveals only that vehicle's connectivity.
  const showsLink = (...ids: string[]) =>
    linksOn || (hoveredId !== null && ids.includes(hoveredId));

  return (
    <MapRoot ref={rootRef}>
      <MapCanvas
        ref={canvasRef}
        panning={panning}
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        }}
        {...handlers}
      >
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

          {(linksOn || hoveredId) && (
            <g>
              {/* Radio-only connectivity: platform ↔ ground station */}
              {radioPlatforms.filter((unit) => showsLink(unit.id)).map((unit) => (
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
                  (link) =>
                    hasRadio(findPlatform(link.from)) &&
                    hasRadio(findPlatform(link.to)) &&
                    showsLink(link.from, link.to),
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
                .filter((id) => hasRadio(findPlatform(id)) && showsLink(id))
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
          badgeSize={36}
          style={{
            left: `${stationDrag.position.x}%`,
            top: `${stationDrag.position.y}%`,
          }}
        >
          <Tooltip title={formatCoordinates(stationDrag.position)} arrow placement="top">
            <DraggableNode
              dragging={stationDrag.dragging}
              role="button"
              aria-label="Control room: drag to move, click for parameters"
              onClick={() => {
                if (stationDrag.dragging) return;
                onSelectRelay?.(null);
                onSelectVehicle?.(null);
              }}
              onContextMenu={(event) => {
                event.preventDefault();
                setCoordTarget("station");
              }}
              {...stationDrag.handlers}
            >
              <NodeBadge shape="circle" borderColor={theme.palette.primary.main}>
                <PingRing />
                <RadioIcon />
              </NodeBadge>
              <NodeLabel>CONTROL ROOM</NodeLabel>
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
          
          const offset = stackOffsets[unit.id] ?? { dx: 0, dy: 0, stacked: false };
          const raised = hoveredId === unit.id || selectedVehicleId === unit.id;
          return (
            <AnchoredPoint
              key={unit.id}
              badgeSize={30}
              style={{
                left: `calc(${unit.x}% + ${offset.dx}px)`,
                top: `calc(${unit.y}% + ${offset.dy}px)`,
                zIndex: raised ? 40 : offset.stacked ? 10 : 5,
              }}
            >
              <MarkerColumn
                onMouseEnter={() => setHoveredId(unit.id)}
                onMouseLeave={() => setHoveredId((prev) => (prev === unit.id ? null : prev))}
              >
                <NodeBadge shape="square" borderColor={theme.palette.primary.main}>
                  <TruckIcon />
                </NodeBadge>
                <PlatformCard
                  unit={unit}
                  variant="overlay"
                  compact
                  selected={selectedVehicleId === unit.id}
                  onSelect={() =>
                    onSelectVehicle?.(selectedVehicleId === unit.id ? null : unit.id)
                  }
                />
              </MarkerColumn>
            </AnchoredPoint>
          );
        })}

        <AnchoredPoint
          badgeSize={36}
          style={{ left: `${relayDrag.position.x}%`, top: `${relayDrag.position.y}%` }}
        >
          <Tooltip title={formatCoordinates(relayDrag.position)} arrow placement="top">
            <DraggableNode
              dragging={relayDrag.dragging}
              role="button"
              aria-label="Drag relay"
              onContextMenu={(event) => {
                event.preventDefault();
                setCoordTarget("relay");
              }}
              {...relayDrag.handlers}
            >
              <NodeBadge shape="circle" borderColor={color(relay.status)}>
                <HubIcon />
              </NodeBadge>
              <PlatformCard unit={relay} variant="overlay" camera={false} compact hideTitle />
            </DraggableNode>
          </Tooltip>
        </AnchoredPoint>

      </OverlayLayer>
      </MapCanvas>

      <OverlayLayer>
        <InfoChip sx={{ left: 12, top: 12 }}>
          <MyLocationIcon /> {coordinates}
        </InfoChip>

        {/* The link legend only makes sense while mesh links are drawn. */}
        {linksOn && (
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
        )}

        {stationOffscreen && (
          <OffscreenArrow
            angle={stationOffscreen.angle}
            style={{ left: stationOffscreen.left, top: stationOffscreen.top }}
            aria-label="Control room direction"
            title="Control room is off screen"
          >
            <NavigationIcon /> CR
          </OffscreenArrow>
        )}

        <ScaleBox>
          <ScaleBar />
          <div>{scaleLabel}</div>
        </ScaleBox>
      </OverlayLayer>

      <ZoomControls>
        <ZoomButton type="button" aria-label="Zoom in" onClick={() => zoomBy(1.3)}>
          <AddIcon />
        </ZoomButton>
        <ZoomButton type="button" aria-label="Zoom out" onClick={() => zoomBy(1 / 1.3)}>
          <RemoveIcon />
        </ZoomButton>
        <ZoomButton type="button" aria-label="Reset view" onClick={reset}>
          <CenterIcon />
        </ZoomButton>
      </ZoomControls>

      <CoordinateDialog
        open={coordTarget !== null}
        title={coordTarget === "relay" ? relay.label : "CONTROL ROOM"}
        value={coordTarget === "relay" ? relayDrag.position : stationDrag.position}
        onClose={() => setCoordTarget(null)}
        onSubmit={(position) =>
          coordTarget === "relay"
            ? relayDrag.setPosition(position)
            : stationDrag.setPosition(position)
        }
      />
    </MapRoot>
  );
}
