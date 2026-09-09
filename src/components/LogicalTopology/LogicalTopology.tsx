import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import HubIcon from "@mui/icons-material/Hub";
import RouterIcon from "@mui/icons-material/Router";
import LanIcon from "@mui/icons-material/DeviceHub";
import SatelliteIcon from "@mui/icons-material/SatelliteAlt";

import { PlatformCard } from "@/components/PlatformCard";
import { platforms } from "@/data/network";
import type { LinkKind, PlatformUnit } from "@/types/network";
import {
  CommandCaption,
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
  RouteTag,
  RouterModule,
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
  /** Platform whose route this segment belongs to. */
  owner: string;
  path: string;
  color: string;
  dashed: boolean;
  /** Download rate rendered beside the line. */
  label: string;
  labelX: number;
  labelY: number;
}

/** How a platform reaches the network node. */
interface Route {
  unit: PlatformUnit;
  /** Peer platform used as a relay, or null when the node is reached directly. */
  peer: PlatformUnit | null;
}

const ROUTER_ID = "cr-router";
const NODE_ID = "net-node";
const CONTROL_ROOM_ROUTER = "ROUTER CONVOY 23";
const NETWORK_NODE = "NETWORK NODE NN-1";

const kindsOf = (unit: PlatformUnit): LinkKind[] => unit.activeLinks ?? [unit.link];

const primaryKind = (unit: PlatformUnit): LinkKind => kindsOf(unit)[0]!;

/** Cellular and satellite reach the control room directly; radio-only does not. */
const hasDirectVisibility = (unit: PlatformUnit): boolean =>
  kindsOf(unit).some((kind) => kind === "CELLULAR" || kind === "SATCOM");

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
   * Every platform reaches the network node. Platforms without direct
   * visibility hop through a peer platform that does have it.
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

  const routerColor = theme.palette.primary.main;
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
    const port = (
      shape: { left: number; width: number },
      index: number,
      count: number,
    ): number => shape.left + (shape.width * (index + 1)) / (count + 1);

    const next: Edge[] = [];
    const order = routes.map((route) => route.unit.id);
    const colorFor = (unit: PlatformUnit) =>
      linksOn ? theme.palette.status[unit.status] : theme.palette.divider;

    routes.forEach((route, index) => {
      const unitBox = box(route.unit.id);
      if (!unitBox) return;
      const color = colorFor(route.unit);
      const rate = `↓ ${route.unit.mbps} Mbps`;
      const nodeInX = port(node, index, order.length);
      const routerX = port(router, index, order.length);

      /** Feeding point into the network node: the platform itself or its peer. */
      let feedX = unitBox.center;
      let feedY = unitBox.top;

      if (route.peer) {
        const peerBox = box(route.peer.id);
        if (peerBox) {
          const peerIndex = peerRoutes.findIndex((r) => r.unit.id === route.unit.id);
          /** Relayed platform → relaying platform, along the bottom row. */
          const lateralY = unitBox.top - 18 - peerIndex * 10;
          const entryX = peerBox.center + 16 + peerIndex * 10;
          next.push({
            id: `${route.unit.id}->peer`,
            owner: route.unit.id,
            path: `M ${unitBox.center} ${unitBox.top} V ${lateralY} H ${entryX} V ${peerBox.top}`,
            color,
            dashed: true,
            label: rate,
            labelX: (unitBox.center + entryX) / 2,
            labelY: lateralY - 5,
          });
          feedX = entryX;
          feedY = peerBox.top;
        }
      }

      /** Relaying platform (or the platform itself) → network node. */
      next.push({
        id: `${route.unit.id}->node`,
        owner: route.unit.id,
        path: `M ${feedX} ${feedY} V ${node.bottom + 26 + index * 6} H ${nodeInX} V ${node.bottom}`,
        color,
        dashed: false,
        label: rate,
        labelX: nodeInX,
        labelY: node.bottom + 20 + index * 6,
      });

      /** One dedicated network node → router line per platform. */
      next.push({
        id: `${route.unit.id}->router`,
        owner: route.unit.id,
        path: `M ${nodeInX} ${node.top} V ${node.top - 26 - index * 6} H ${routerX} V ${router.bottom}`,
        color,
        dashed: false,
        label: rate,
        labelX: routerX,
        labelY: node.top - 32 - index * 6,
      });
    });

    setEdges(next);
  }, [linksOn, theme, routes, peerRoutes]);

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
  const nodeDimmed = () => false;

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
            const active = activeRoute === null || edge.owner === activeRoute;
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
              onClick={openControlRoom}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") openControlRoom();
              }}
              aria-label="Show control room parameters in the side panel"
            >
              <CommandRow>
                <HubIcon /> CONTROL ROOM
              </CommandRow>
              <CommandCaption>
                <SatelliteNode as="span">
                  <SatelliteIcon /> TELS-1 SATELLITE
                </SatelliteNode>
              </CommandCaption>
              <RouterModule ref={setNodeRef(ROUTER_ID)}>
                <RouterIcon /> {CONTROL_ROOM_ROUTER}
                <ModemMeta>{routes.length} PORTS</ModemMeta>
              </RouterModule>
            </CommandNode>
          </LayerRow>

          <LayerRow>
            <HopNode ref={setNodeRef(NODE_ID)} accent={nodeColor} dimmed={nodeDimmed()}>
              <HopRow>
                <LanIcon /> {NETWORK_NODE}
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
                  <RouteTag
                    labelColor={
                      linksOn
                        ? route.peer === null
                          ? routerColor
                          : nodeColor
                        : theme.palette.divider
                    }
                  >
                    {primaryKind(route.unit)} →{" "}
                    {route.peer ? route.peer.label : NETWORK_NODE}
                  </RouteTag>
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
            <LegendSwatch swatchColor={theme.palette.text.secondary} dashed /> VIA PEER
            PLATFORM
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
