import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import HubIcon from "@mui/icons-material/Hub";
import RouterIcon from "@mui/icons-material/Router";
import MemoryIcon from "@mui/icons-material/Memory";
import RadioIcon from "@mui/icons-material/SettingsInputAntenna";
import SatelliteIcon from "@mui/icons-material/SatelliteAlt";
import { ControlRoomDrawer } from "@/components/ControlRoomDrawer";
import { PlatformCard } from "@/components/PlatformCard";
import { platforms, relays } from "@/data/network";
import type { LinkKind, LinkStatus, PlatformUnit } from "@/types/network";
import {
  Cluster,
  ClusterMembers,
  ClusterTitle,
  CommandCaption,
  CommandNode,
  CommandRow,
  EdgeLabel,
  EdgeSvg,
  HopCaption,
  HopNode,
  HopRow,
  LayerCaption,
  LayerColumn,
  LayerGrid,
  Legend,
  LegendItem,
  LegendSwatch,
  ModemMeta,
  ModemModule,
  NodeSlot,
  SatelliteNode,
  TopologyContent,
  TopologyRoot,
} from "./LogicalTopology.styles";

export interface LogicalTopologyProps {
  /** Hides link colouring when false, matching the tactical view. */
  linksOn: boolean;
  selectedVehicleId?: string | null;
  onSelectVehicle?: (id: string | null) => void;
  /** Clicking the control room swaps the right-hand panel to its parameters. */
  onOpenControlRoom?: () => void;
}

interface Edge {
  id: string;
  /** Vehicle whose route this edge belongs to; hop→modem edges list several. */
  owners: string[];
  path: string;
  color: string;
  dashed: boolean;
  /** Download rate rendered beside the line. */
  label: string;
  labelX: number;
  labelY: number;
}

const MODEM_ID = "cr-modem";
const ROUTER_ID = "net-router";
const CONTROL_ROOM_MODEM = "CONVOY 23";

const primaryKind = (unit: PlatformUnit): LinkKind => (unit.activeLinks ?? [unit.link])[0]!;

const usesRelay = (unit: PlatformUnit): boolean => {
  const relay = relays[0];
  if (!relay) return false;
  const kinds = unit.activeLinks ?? [unit.link];
  return kinds.includes("RADIO") && relay.connectedTo.includes(unit.id);
};

const STATUS_ORDER: LinkStatus[] = ["good", "marginal", "poor"];

/** The hop→modem link carries its own state: the worst of the platforms it serves. */
const worstStatus = (members: PlatformUnit[]): LinkStatus =>
  members.reduce<LinkStatus>(
    (worst, unit) =>
      STATUS_ORDER.indexOf(unit.status) > STATUS_ORDER.indexOf(worst) ? unit.status : worst,
    "good",
  );

const sumRate = (members: PlatformUnit[]): string =>
  members.reduce((total, unit) => total + Number.parseFloat(unit.mbps), 0).toFixed(1);

export function LogicalTopology({
  linksOn,
  selectedVehicleId = null,
  onSelectVehicle,
}: LogicalTopologyProps) {
  const theme = useTheme();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [edges, setEdges] = useState<Edge[]>([]);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [hovered, setHovered] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const relay = relays[0] ?? null;
  const relayGroup = useMemo(() => platforms.filter(usesRelay), []);
  const routerGroup = useMemo(() => platforms.filter((p) => !usesRelay(p)), []);

  const routerColor = theme.palette.primary.main;
  const relayColor = theme.palette.warning.main;

  /** Which vehicle route is emphasised right now. */
  const activeRoute = hovered ?? selectedVehicleId;

  const setNodeRef = (id: string) => (element: HTMLElement | null) => {
    if (element) nodeRefs.current.set(id, element);
    else nodeRefs.current.delete(id);
  };

  const measure = useCallback(() => {
    const content = contentRef.current;
    if (!content) return;
    const base = content.getBoundingClientRect();
    setSize({ width: content.scrollWidth, height: content.scrollHeight });

    const box = (id: string) => {
      const element = nodeRefs.current.get(id);
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return {
        left: rect.left - base.left,
        right: rect.right - base.left,
        top: rect.top - base.top,
        middle: rect.top - base.top + rect.height / 2,
      };
    };

    const modem = box(MODEM_ID);
    if (!modem) return;

    const next: Edge[] = [];
    const elbow = (
      from: { right: number; middle: number },
      to: { left: number; middle: number },
    ) => {
      const midX = from.right + (to.left - from.right) / 2;
      return {
        path: `M ${from.right} ${from.middle} H ${midX} V ${to.middle} H ${to.left}`,
        labelX: from.right + (midX - from.right) / 2,
        labelY: from.middle - 6,
      };
    };

    const hops: { id: string; members: PlatformUnit[]; dashed: boolean }[] = [
      { id: ROUTER_ID, members: routerGroup, dashed: false },
      ...(relay ? [{ id: relay.id, members: relayGroup, dashed: true }] : []),
    ];

    for (const hop of hops) {
      const hopBox = box(hop.id);
      if (!hopBox) continue;

      for (const unit of hop.members) {
        const unitBox = box(unit.id);
        if (!unitBox) continue;
        const geometry = elbow(unitBox, hopBox);
        next.push({
          id: `${unit.id}->${hop.id}`,
          owners: [unit.id],
          ...geometry,
          color: linksOn ? theme.palette.status[unit.status] : theme.palette.divider,
          dashed: hop.dashed,
          label: `↓ ${unit.mbps} Mbps`,
        });
      }

      const trunk = elbow(hopBox, modem);
      next.push({
        id: `${hop.id}->${MODEM_ID}`,
        owners: hop.members.map((m) => m.id),
        ...trunk,
        color: linksOn
          ? theme.palette.status[worstStatus(hop.members)]
          : theme.palette.divider,
        dashed: hop.dashed,
        label: `↓ ${sumRate(hop.members)} Mbps`,
      });
    }

    setEdges(next);
  }, [linksOn, theme, relay, relayGroup, routerGroup, routerColor, relayColor]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(content);
    for (const element of nodeRefs.current.values()) observer.observe(element);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const isDimmed = (vehicleId: string) => activeRoute !== null && activeRoute !== vehicleId;
  const hopDimmed = (members: PlatformUnit[]) =>
    activeRoute !== null && !members.some((m) => m.id === activeRoute);

  const renderCluster = (
    title: string,
    accent: string,
    members: PlatformUnit[],
    label: string,
  ) => (
    <Cluster accent={accent}>
      <ClusterTitle accent={accent}>{title}</ClusterTitle>
      <ClusterMembers>
        {members.map((unit) => (
          <NodeSlot
            key={unit.id}
            dimmed={isDimmed(unit.id)}
            onMouseEnter={() => setHovered(unit.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <div ref={setNodeRef(unit.id)}>
              <EdgeLabel labelColor={linksOn ? accent : theme.palette.divider}>
                {primaryKind(unit)} → {label}
              </EdgeLabel>
              <PlatformCard
                unit={unit}
                variant="topology"
                compact
                selected={selectedVehicleId === unit.id}
                onSelect={() => onSelectVehicle?.(selectedVehicleId === unit.id ? null : unit.id)}
              />
            </div>
          </NodeSlot>
        ))}
      </ClusterMembers>
    </Cluster>
  );

  return (
    <TopologyRoot>
      <TopologyContent ref={contentRef}>
        <EdgeSvg
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${Math.max(size.width, 1)} ${Math.max(size.height, 1)}`}
          aria-hidden="true"
        >
          {edges.map((edge) => {
            const active = activeRoute === null || edge.owners.includes(activeRoute);
            return (
              <path
                key={edge.id}
                d={edge.path}
                fill="none"
                stroke={edge.color}
                strokeWidth={active && activeRoute !== null ? 2.4 : 1.6}
                strokeDasharray={edge.dashed ? "5 4" : undefined}
                strokeLinejoin="round"
                opacity={active ? 0.95 : 0.18}
              />
            );
          })}
        </EdgeSvg>

        <LayerGrid>
          <LayerColumn>
            <LayerCaption>PLATFORMS</LayerCaption>
            {renderCluster("DIRECT · ROUTER GROUP", routerColor, routerGroup, "ROUTER")}
            {relay && renderCluster("RELAY GROUP", relayColor, relayGroup, "RELAY")}
          </LayerColumn>

          <LayerColumn>
            <LayerCaption>NETWORK NODES</LayerCaption>
            <HopNode
              ref={setNodeRef(ROUTER_ID)}
              accent={routerColor}
              dimmed={hopDimmed(routerGroup)}
            >
              <HopRow>
                <RouterIcon /> ROUTER
              </HopRow>
              <HopCaption>{routerGroup.length} DIRECT PLATFORMS</HopCaption>
            </HopNode>

            {relay && (
              <HopNode ref={setNodeRef(relay.id)} accent={relayColor} dimmed={hopDimmed(relayGroup)}>
                <HopRow>
                  <RadioIcon /> {relay.label}
                </HopRow>
                <HopCaption>{relayGroup.length} RELAYED PLATFORMS</HopCaption>
              </HopNode>
            )}
          </LayerColumn>

          <LayerColumn>
            <LayerCaption>CONTROL ROOM</LayerCaption>
            <SatelliteNode>
              <SatelliteIcon /> TELS-1 SATELLITE
            </SatelliteNode>
            <CommandNode
              role="button"
              tabIndex={0}
              onClick={() => setDrawerOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") setDrawerOpen(true);
              }}
              aria-label="Open control room parameters"
            >
              <CommandRow>
                <HubIcon /> CONTROL ROOM
              </CommandRow>
              <CommandCaption>INTERNAL MODEM MODULES</CommandCaption>
              <ModemModule ref={setNodeRef(MODEM_ID)}>
                <MemoryIcon /> J8
                <ModemMeta>ACTIVE</ModemMeta>
              </ModemModule>
            </CommandNode>
          </LayerColumn>
        </LayerGrid>

        <Legend>
          <LegendItem>
            <LegendSwatch swatchColor={routerColor} /> DIRECT → ROUTER
          </LegendItem>
          <LegendItem>
            <LegendSwatch swatchColor={relayColor} dashed /> VIA RELAY
          </LegendItem>
          <LegendItem>
            <LegendSwatch swatchColor={theme.palette.status.good} /> ACTIVE
          </LegendItem>
          <LegendItem>
            <LegendSwatch swatchColor={theme.palette.status.marginal} /> WARNING
          </LegendItem>
          <LegendItem>
            <LegendSwatch swatchColor={theme.palette.status.poor} /> DEGRADED
          </LegendItem>
        </Legend>
      </TopologyContent>

      <ControlRoomDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} modemName="J8" />
    </TopologyRoot>
  );
}
