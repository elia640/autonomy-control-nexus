import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import HubIcon from "@mui/icons-material/Hub";
import RouterIcon from "@mui/icons-material/Router";
import RadioIcon from "@mui/icons-material/SettingsInputAntenna";
import SatelliteIcon from "@mui/icons-material/SatelliteAlt";

import { PlatformCard } from "@/components/PlatformCard";
import { platforms, relays } from "@/data/network";
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

/** How a platform reaches the control room router. */
interface Route {
  unit: PlatformUnit;
  /** Node id of the intermediate hop, or null when the link is direct. */
  hopId: string | null;
  hopLabel: string;
}

const ROUTER_ID = "cr-router";
const CONTROL_ROOM_ROUTER = "ROUTER CONVOY 23";

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

  const relay = relays[0] ?? null;

  /**
   * Every platform gets a route: direct to the router, through the relay unit,
   * or through a peer platform that does have direct visibility.
   */
  const routes = useMemo<Route[]>(
    () =>
      platforms.map((unit) => {
        if (hasDirectVisibility(unit)) return { unit, hopId: null, hopLabel: "DIRECT" };
        if (relay && relay.connectedTo.includes(unit.id))
          return { unit, hopId: relay.id, hopLabel: relay.label };
        const peer = platforms.find((p) => p.id !== unit.id && hasDirectVisibility(p));
        return peer
          ? { unit, hopId: peer.id, hopLabel: peer.label }
          : { unit, hopId: null, hopLabel: "DIRECT" };
      }),
    [relay],
  );

  const relayRoutes = useMemo(() => routes.filter((r) => r.hopId !== null), [routes]);

  const routerColor = theme.palette.primary.main;
  const relayColor = theme.palette.warning.main;

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
    const hopBox = relay ? box(relay.id) : null;
    if (!router) return;

    /** Spreads several lines across the horizontal edge of a node. */
    const port = (
      node: { left: number; width: number },
      index: number,
      count: number,
    ): number => node.left + (node.width * (index + 1)) / (count + 1);

    /** Vertical run with one horizontal jog at the given y. */
    const vertical = (
      id: string,
      owner: string,
      from: { x: number; y: number },
      to: { x: number; y: number },
      jogY: number,
      color: string,
      dashed: boolean,
      label: string,
    ): Edge => ({
      id,
      owner,
      path: `M ${from.x} ${from.y} V ${jogY} H ${to.x} V ${to.y}`,
      color,
      dashed,
      label,
      labelX: to.x,
      labelY: (jogY + to.y) / 2 - 4,
    });

    const next: Edge[] = [];
    const routerOrder = routes.map((route) => route.unit.id);
    const colorFor = (unit: PlatformUnit) =>
      linksOn ? theme.palette.status[unit.status] : theme.palette.divider;

    routes.forEach((route) => {
      const unitBox = box(route.unit.id);
      if (!unitBox) return;
      const routerPortIndex = routerOrder.indexOf(route.unit.id);
      const routerX = port(router, routerPortIndex, routerOrder.length);
      const color = colorFor(route.unit);
      const rate = `↓ ${route.unit.mbps} Mbps`;

      if (route.hopId === null || !hopBox) {
        /** Direct lines skirt the relay box by jogging beside it. */
        const sideX =
          unitBox.center < hopBox!.center
            ? Math.min(unitBox.center, hopBox!.left - 28)
            : Math.max(unitBox.center, hopBox!.right + 28);
        next.push({
          id: `${route.unit.id}->router`,
          owner: route.unit.id,
          path: `M ${unitBox.center} ${unitBox.top} V ${hopBox!.bottom + 14} H ${sideX} V ${hopBox!.top - 14} H ${routerX} V ${router.bottom}`,
          color,
          dashed: false,
          label: rate,
          labelX: sideX,
          labelY: (hopBox!.top + hopBox!.bottom) / 2,
        });
        return;
      }

      const hopIndex = relayRoutes.findIndex((r) => r.unit.id === route.unit.id);
      const hopInX = port(hopBox, hopIndex, relayRoutes.length);

      next.push(
        vertical(
          `${route.unit.id}->hop`,
          route.unit.id,
          { x: unitBox.center, y: unitBox.top },
          { x: hopInX, y: hopBox.bottom },
          hopBox.bottom + 28,
          color,
          false,
          rate,
        ),
      );
      /** A dedicated hop→router line per platform, one for one. */
      next.push(
        vertical(
          `${route.unit.id}-hop->router`,
          route.unit.id,
          { x: hopInX, y: hopBox.top },
          { x: routerX, y: router.bottom },
          hopBox.top - 24 - hopIndex * 8,
          color,
          true,
          rate,
        ),
      );
    });

    setEdges(next);
  }, [linksOn, theme, routes, relayRoutes, relay]);

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
  const hopDimmed = () =>
    activeRoute !== null && !relayRoutes.some((r) => r.unit.id === activeRoute);

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
            {relay && (
              <HopNode ref={setNodeRef(relay.id)} accent={relayColor} dimmed={hopDimmed()}>
                <HopRow>
                  <RadioIcon /> {relay.label}
                </HopRow>
                <HopCaption>{relayRoutes.length} RELAYED PLATFORMS</HopCaption>
                <HopCaption>
                  {relay.mbps} Mbps · {relay.lat}
                </HopCaption>
              </HopNode>
            )}
          </LayerRow>

          <LayerRow>
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
                        ? route.hopId === null
                          ? routerColor
                          : relayColor
                        : theme.palette.divider
                    }
                  >
                    {primaryKind(route.unit)} → {route.hopLabel}
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
          </LayerRow>
        </LayerStack>

        <Legend>
          <LegendItem>
            <LegendSwatch swatchColor={theme.palette.text.secondary} /> DIRECT LINK
          </LegendItem>
          <LegendItem>
            <LegendSwatch swatchColor={theme.palette.text.secondary} dashed /> VIA RELAY
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
