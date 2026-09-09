import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import HubIcon from "@mui/icons-material/Hub";
import RouterIcon from "@mui/icons-material/Router";
import LanIcon from "@mui/icons-material/DeviceHub";

import { PlatformCard } from "@/components/PlatformCard";
import { platforms } from "@/data/network";
import type { LinkKind, LinkStatus, PlatformUnit } from "@/types/network";
import {
  CommandNode,
  CommandRow,
  EdgeSvg,
  HopCaption,
  HopNode,
  HopRow,
  LayerCaption,
  LayerRow,
  LayerStack,
  Legend,
  LegendItem,
  LegendSwatch,
  ModemMeta,
  NodeSlot,
  PlatformRow,
  RouterModule,
  TopologyContent,
  TopologyRoot,
} from "./LogicalTopology.styles";

export interface LogicalTopologyProps {
  /** Hides link colouring when false, matching the tactical view. */
  linksOn: boolean;
  selectedVehicleId?: string | null;
  onSelectVehicle?: (id: string | null) => void;
  /** Clicking the control room (or the empty canvas) shows its parameters. */
  onOpenControlRoom?: () => void;
}

interface Edge {
  id: string;
  /** Every platform whose traffic travels over this segment. */
  owners: string[];
  path: string;
  color: string;
  dashed: boolean;
  /** Aggregated download rate rendered beside the line. */
  label: string;
  labelX: number;
  labelY: number;
}

/** How a platform reaches the halo server. */
interface Route {
  unit: PlatformUnit;
  /** Peer platform used as a relay, or null when the server is reached directly. */
  peer: PlatformUnit | null;
}

const ROUTER_ID = "cr-halo";
const NODE_ID = "halo-server";
const CONTROL_ROOM_HALO = "HALO CONVOY 23";
const HALO_SERVER = "HALO SERVER";

const kindsOf = (unit: PlatformUnit): LinkKind[] => unit.activeLinks ?? [unit.link];

/** Cellular and satellite reach the control room directly; radio-only does not. */
const hasDirectVisibility = (unit: PlatformUnit): boolean =>
  kindsOf(unit).some((kind) => kind === "CELLULAR" || kind === "SATCOM");

const WORST: Record<LinkStatus, number> = { good: 0, marginal: 1, poor: 2 };

export function LogicalTopology({
  linksOn,
  selectedVehicleId = null,
  onSelectVehicle,
  onOpenControlRoom,
}: LogicalTopologyProps) {
  const theme = useTheme();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [edges, setEdges] = useState<Edge[]>([]);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [hovered, setHovered] = useState<string | null>(null);

  /** The side panel shows the control room whenever no platform is selected. */
  const openControlRoom = () => {
    onSelectVehicle?.(null);
    onOpenControlRoom?.();
  };

  /**
   * Every platform reaches the halo server. Platforms without direct
   * visibility hop through a peer platform that does have it, and their
   * traffic is then carried on the peer's single line to the server.
   */
  const routes = useMemo<Route[]>(
    () =>
      platforms.map((unit) => {
        if (hasDirectVisibility(unit)) return { unit, peer: null };
        const peer = platforms.find((p) => p.id !== unit.id && hasDirectVisibility(p));
        return { unit, peer: peer ?? null };
      }),
    [],
  );

  const peerRoutes = useMemo(() => routes.filter((r) => r.peer !== null), [routes]);

  /** One trunk per directly visible platform, carrying its relayed peers too. */
  const trunks = useMemo(
    () =>
      routes
        .filter((r) => r.peer === null)
        .map((r) => ({
          unit: r.unit,
          carried: peerRoutes.filter((p) => p.peer?.id === r.unit.id).map((p) => p.unit),
        })),
    [routes, peerRoutes],
  );

  const nodeColor = theme.palette.info?.main ?? theme.palette.primary.light;

  /** Which platform route is emphasised right now. */
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
        width: rect.width,
        top: rect.top - base.top,
        bottom: rect.bottom - base.top,
        center: rect.left - base.left + rect.width / 2,
      };
    };

    const router = box(ROUTER_ID);
    const node = box(NODE_ID);
    if (!router || !node) return;

    /** Spreads several lines across the horizontal edge of a node. */
    const port = (shape: { left: number; width: number }, index: number, count: number): number =>
      shape.left + (shape.width * (index + 1)) / (count + 1);

    const next: Edge[] = [];

    /** Sorting trunks left-to-right keeps trunk lines from crossing. */
    const ordered = trunks
      .map((trunk) => ({ trunk, x: box(trunk.unit.id)?.center ?? 0 }))
      .sort((a, b) => a.x - b.x)
      .map((entry) => entry.trunk);

    const colorFor = (status: LinkStatus) =>
      linksOn ? theme.palette.status[status] : theme.palette.divider;
    const rateOf = (unit: PlatformUnit) => Number.parseFloat(unit.mbps) || 0;

    ordered.forEach((trunk, index) => {
      const unitBox = box(trunk.unit.id);
      if (!unitBox) return;

      /** Relayed platform -> relaying platform, routed under the platform row. */
      trunk.carried.forEach((carried, carriedIndex) => {
        const carriedBox = box(carried.id);
        if (!carriedBox) return;
        const lateralY = Math.max(unitBox.bottom, carriedBox.bottom) + 18 + carriedIndex * 12;
        const entryX = unitBox.center + 16 + carriedIndex * 12;
        next.push({
          id: `${carried.id}->peer`,
          owners: [carried.id],
          path: `M ${carriedBox.center} ${carriedBox.bottom} V ${lateralY} H ${entryX} V ${unitBox.bottom}`,
          color: colorFor(carried.status),
          dashed: true,
          label: `↓ ${carried.mbps} Mbps`,
          labelX: (carriedBox.center + entryX) / 2,
          labelY: lateralY - 5,
        });
      });

      /** One consolidated trunk: platform (+ everything it relays) -> halo server. */
      const group = [trunk.unit, ...trunk.carried];
      const owners = group.map((unit) => unit.id);
      const worst = group.reduce<LinkStatus>(
        (acc, unit) => (WORST[unit.status] > WORST[acc] ? unit.status : acc),
        "good",
      );
      const total = group.reduce((sum, unit) => sum + rateOf(unit), 0);
      const color = colorFor(worst);
      const label = `↓ ${total.toFixed(1)} Mbps`;

      const nodeInX = port(node, index, ordered.length);
      const routerX = port(router, index, ordered.length);

      next.push({
        id: `${trunk.unit.id}->node`,
        owners,
        path: `M ${unitBox.center} ${unitBox.top} L ${nodeInX} ${node.bottom}`,
        color,
        dashed: false,
        label,
        labelX: (unitBox.center + nodeInX) / 2,
        labelY: (unitBox.top + node.bottom) / 2 - 4,
      });

      /** Halo server -> control room halo: one line per incoming trunk. */
      next.push({
        id: `${trunk.unit.id}->router`,
        owners,
        path: `M ${nodeInX} ${node.top} L ${routerX} ${router.bottom}`,
        color,
        dashed: false,
        label,
        labelX: (nodeInX + routerX) / 2,
        labelY: (node.top + router.bottom) / 2 - 4,
      });
    });

    setEdges(next);
  }, [linksOn, theme, trunks]);

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

  const isDimmed = (id: string) => activeRoute !== null && activeRoute !== id;

  return (
    <TopologyRoot
      /** Clicking empty canvas clears the selection and returns to the control room. */
      onClick={openControlRoom}
    >
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
              <g key={edge.id} opacity={active ? 0.95 : 0.15}>
                <path
                  d={edge.path}
                  fill="none"
                  stroke={edge.color}
                  strokeWidth={active && activeRoute !== null ? 2.4 : 1.6}
                  strokeDasharray={edge.dashed ? "5 4" : undefined}
                  strokeLinejoin="round"
                />
                {/* Download rate travelling over this link. */}
                <text
                  x={edge.labelX}
                  y={edge.labelY}
                  fill={edge.color}
                  fontSize={11}
                  fontWeight={600}
                  textAnchor="middle"
                  stroke={theme.palette.background.default}
                  strokeWidth={3}
                  paintOrder="stroke"
                >
                  {edge.label}
                </text>
              </g>
            );
          })}
        </EdgeSvg>

        <LayerStack>
          <LayerRow>
            <CommandNode
              role="button"
              tabIndex={0}
              onClick={(event) => {
                event.stopPropagation();
                openControlRoom();
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") openControlRoom();
              }}
              aria-label="Show control room parameters in the side panel"
            >
              <CommandRow>
                <HubIcon /> CONTROL ROOM
              </CommandRow>
              <RouterModule ref={setNodeRef(ROUTER_ID)}>
                <RouterIcon /> {CONTROL_ROOM_HALO}
                <ModemMeta>{trunks.length} PORTS</ModemMeta>
              </RouterModule>
            </CommandNode>
          </LayerRow>

          <LayerRow>
            <HopNode ref={setNodeRef(NODE_ID)} accent={nodeColor}>
              <HopRow>
                <LanIcon /> {HALO_SERVER}
              </HopRow>
              <HopCaption>{routes.length} CONNECTED PLATFORMS</HopCaption>
              <HopCaption>{peerRoutes.length} VIA PEER RELAY</HopCaption>
            </HopNode>
          </LayerRow>

          <PlatformRow>
            <LayerCaption>PLATFORMS</LayerCaption>
            {routes.map((route) => (
              <NodeSlot
                key={route.unit.id}
                dimmed={isDimmed(route.unit.id)}
                onMouseEnter={() => setHovered(route.unit.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <div ref={setNodeRef(route.unit.id)}>
                  <PlatformCard
                    unit={route.unit}
                    variant="topology"
                    compact
                    selected={selectedVehicleId === route.unit.id}
                    onSelect={() =>
                      onSelectVehicle?.(
                        selectedVehicleId === route.unit.id ? null : route.unit.id,
                      )
                    }
                  />
                </div>
              </NodeSlot>
            ))}
          </PlatformRow>
        </LayerStack>

        <Legend>
          <LegendItem>
            <LegendSwatch swatchColor={theme.palette.text.secondary} /> DIRECT LINK
          </LegendItem>
          <LegendItem>
            <LegendSwatch swatchColor={theme.palette.text.secondary} dashed /> VIA PEER PLATFORM
          </LegendItem>
          <LegendItem>
            <LegendSwatch swatchColor={theme.palette.status.good} /> GOOD
          </LegendItem>
          <LegendItem>
            <LegendSwatch swatchColor={theme.palette.status.marginal} /> FAIR
          </LegendItem>
          <LegendItem>
            <LegendSwatch swatchColor={theme.palette.status.poor} /> POOR
          </LegendItem>
        </Legend>
      </TopologyContent>
    </TopologyRoot>
  );
}
