import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useTheme } from "@mui/material/styles";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { meshMargins, platforms, radioLinks, relays } from "@/data/network";
import type { LinkStatus } from "@/types/network";
import {
  LegendDot,
  WheelBody,
  WheelHeader,
  WheelLegend,
  WheelRoot,
  WheelSpacer,
  WheelSvg,
  WheelToggle,
} from "./ConnectivityWheel.styles";

interface WheelNode {
  id: string;
  short: string;
  label: string;
  x: number;
  y: number;
}

interface WheelEdge {
  from: string;
  to: string;
  status: LinkStatus;
}

const GROUND_STATION_ID = "gs";
const RADIUS = 34;
const CENTER = 50;

const marginStatus = (margin: number): LinkStatus =>
  margin >= 16 ? "good" : margin >= 10 ? "marginal" : "poor";

const marginOf = (a: string, b: string): number =>
  meshMargins[`${a}|${b}`] ?? meshMargins[`${b}|${a}`] ?? 10;

const ids = [
  { id: GROUND_STATION_ID, short: "GS", label: "GROUND STATION" },
  ...platforms.map((unit) => ({
    id: unit.id,
    short: `P${unit.label.split(" ")[1]}`,
    label: unit.label,
  })),
  ...relays.map((relay) => ({ id: relay.id, short: "RLY", label: relay.label })),
];

const nodes: WheelNode[] = ids.map((node, index) => {
  const angle = (index / ids.length) * Math.PI * 2 - Math.PI / 2;
  return {
    ...node,
    x: CENTER + Math.cos(angle) * RADIUS,
    y: CENTER + Math.sin(angle) * RADIUS,
  };
});

const nodeById = (id: string): WheelNode => nodes.find((node) => node.id === id)!;

const edges: WheelEdge[] = [
  ...radioLinks.map((link) => ({ from: link.from, to: link.to, status: link.status })),
  ...platforms.map((unit) => ({
    from: GROUND_STATION_ID,
    to: unit.id,
    status: marginStatus(marginOf(GROUND_STATION_ID, unit.id)),
  })),
  ...relays.flatMap((relay) =>
    relay.connectedTo.map((id) => ({
      from: relay.id,
      to: id,
      status: marginStatus(marginOf(relay.id, id)),
    })),
  ),
];

export interface ConnectivityWheelProps {
  title?: string;
  defaultExpanded?: boolean;
  /** Initial offset from the top-left of the viewport, in pixels. */
  initialPosition?: { x: number; y: number };
}

export function ConnectivityWheel({
  title = "CONNECTIVITY MAP",
  defaultExpanded = false,
  initialPosition = { x: 24, y: 24 },
}: ConnectivityWheelProps) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [focused, setFocused] = useState<string | null>(null);
  const [position, setPosition] = useState(initialPosition);
  const [dragging, setDragging] = useState(false);
  const offsetRef = useRef({ x: 0, y: 0 });
  const rootRef = useRef<HTMLElement | null>(null);

  const startDrag = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    offsetRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    setDragging(true);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (event: PointerEvent) => {
      setPosition({
        x: event.clientX - offsetRef.current.x,
        y: event.clientY - offsetRef.current.y,
      });
    };
    const onUp = () => setDragging(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging]);

  const isDimmed = (edge: WheelEdge) =>
    focused !== null && edge.from !== focused && edge.to !== focused;

  return (
    <WheelRoot
      ref={rootRef}
      expanded={expanded}
      dragging={dragging}
      style={{ left: position.x, top: position.y }}
    >
      <WheelHeader onPointerDown={startDrag}>
        {title}
        <WheelSpacer />
        <WheelToggle
          onClick={() => setExpanded((value) => !value)}
          aria-label={expanded ? "Shrink connectivity map" : "Enlarge connectivity map"}
        >
          {expanded ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
        </WheelToggle>
      </WheelHeader>

      <WheelBody>
        <WheelSvg viewBox="0 0 100 100" role="img" aria-label="Connectivity between units">
          {edges.map((edge) => {
            const from = nodeById(edge.from);
            const to = nodeById(edge.to);
            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={theme.palette.status[edge.status]}
                strokeWidth={isDimmed(edge) ? 0.35 : 0.7}
                opacity={isDimmed(edge) ? 0.15 : 0.9}
              />
            );
          })}

          {nodes.map((node) => {
            const highlighted = focused === node.id;
            const stroke =
              node.id === GROUND_STATION_ID
                ? theme.palette.primary.main
                : theme.palette.text.secondary;
            return (
              <g
                key={node.id}
                onMouseEnter={() => setFocused(node.id)}
                onMouseLeave={() => setFocused(null)}
                style={{ cursor: "pointer" }}
              >
                <title>{node.label}</title>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={highlighted ? 7 : 6}
                  fill={theme.palette.background.paper}
                  stroke={stroke}
                  strokeWidth={0.6}
                />
                <text
                  x={node.x}
                  y={node.y + 1.6}
                  textAnchor="middle"
                  fontSize="3.6"
                  fill={theme.palette.text.primary}
                >
                  {node.short}
                </text>
              </g>
            );
          })}
        </WheelSvg>

        <WheelLegend>
          {(["good", "marginal", "poor"] as LinkStatus[]).map((status) => (
            <span key={status}>
              <LegendDot dotColor={theme.palette.status[status]} />
              {status}
            </span>
          ))}
        </WheelLegend>
      </WheelBody>
    </WheelRoot>
  );
}
