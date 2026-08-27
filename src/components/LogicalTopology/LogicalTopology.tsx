import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import RadioIcon from "@mui/icons-material/SettingsInputAntenna";
import SatelliteIcon from "@mui/icons-material/SatelliteAlt";
import { PlatformCard } from "@/components/PlatformCard";
import { platforms, relays } from "@/data/network";
import type { LinkKind, PlatformUnit, RelayUnit } from "@/types/network";
import {
  CommandCaption,
  CommandNode,
  CommandRow,
  Connector,
  EdgeLabel,
  EdgeSvg,
  MemberColumn,
  NodeGrid,
  SatelliteNode,
  TopologyColumnStack,
  TopologyContent,
  TopologyRoot,
} from "./LogicalTopology.styles";

export interface LogicalTopologyProps {
  /** Hides link colouring when false, matching the tactical view. */
  linksOn: boolean;
  selectedVehicleId?: string | null;
  onSelectVehicle?: (id: string | null) => void;
}

interface Edge {
  id: string;
  path: string;
  color: string;
  dashed: boolean;
  label: string;
  labelX: number;
  labelY: number;
}

const hasRadio = (unit: PlatformUnit | RelayUnit): boolean =>
  (unit.activeLinks ?? [unit.link]).includes("RADIO");

const primaryKind = (unit: PlatformUnit | RelayUnit): LinkKind =>
  (unit.activeLinks ?? [unit.link])[0] ?? unit.link;

export function LogicalTopology({
  linksOn,
  selectedVehicleId = null,
  onSelectVehicle,
}: LogicalTopologyProps) {
  const theme = useTheme();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const commandRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [edges, setEdges] = useState<Edge[]>([]);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const nodes: (PlatformUnit | RelayUnit)[] = [...relays, ...platforms];

  const setNodeRef = (id: string) => (element: HTMLDivElement | null) => {
    if (element) nodeRefs.current.set(id, element);
    else nodeRefs.current.delete(id);
  };

  const measure = useCallback(() => {
    const content = contentRef.current;
    const command = commandRef.current;
    if (!content || !command) return;

    const base = content.getBoundingClientRect();
    const cp = command.getBoundingClientRect();
    setSize({ width: content.scrollWidth, height: content.scrollHeight });

    const originX = cp.left - base.left + cp.width / 2;
    const originY = cp.bottom - base.top;

    const next: Edge[] = [];
    for (const unit of nodes) {
      const element = nodeRefs.current.get(unit.id);
      if (!element) continue;
      const rect = element.getBoundingClientRect();
      const targetX = rect.left - base.left + rect.width / 2;
      const targetY = rect.top - base.top;
      const busY = originY + Math.max(24, (targetY - originY) * 0.45);
      const radio = hasRadio(unit);

      next.push({
        id: unit.id,
        path: `M ${originX} ${originY} V ${busY} H ${targetX} V ${targetY}`,
        color: linksOn ? theme.palette.status[unit.status] : theme.palette.divider,
        dashed: !radio,
        label: radio ? "RADIO" : primaryKind(unit),
        labelX: targetX,
        labelY: (busY + targetY) / 2,
      });
    }
    setEdges(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linksOn, theme]);

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

  return (
    <TopologyRoot>
      <TopologyContent ref={contentRef}>
        <EdgeSvg
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${Math.max(size.width, 1)} ${Math.max(size.height, 1)}`}
          aria-hidden="true"
        >
          {edges.map((edge) => (
            <path
              key={edge.id}
              d={edge.path}
              fill="none"
              stroke={edge.color}
              strokeWidth={edge.dashed ? 1 : 1.6}
              strokeDasharray={edge.dashed ? "4 4" : undefined}
              strokeLinejoin="round"
              opacity={0.9}
            />
          ))}
        </EdgeSvg>

        <TopologyColumnStack>
          <SatelliteNode>
            <SatelliteIcon /> TELS-1 SATELLITE
          </SatelliteNode>
          <Connector length={24} lineColor={theme.palette.primary.main} />

          <CommandNode ref={commandRef}>
            <CommandRow>
              <RadioIcon /> COMMAND POST · GROUND STATION
            </CommandRow>
            <CommandCaption>NETWORK ROOT · ALL PLATFORM LINKS TERMINATE HERE</CommandCaption>
          </CommandNode>

          <NodeGrid>
            {nodes.map((unit) => {
              const edge = edges.find((item) => item.id === unit.id);
              return (
                <MemberColumn key={unit.id} ref={setNodeRef(unit.id)}>
                  <EdgeLabel labelColor={edge?.color ?? theme.palette.divider}>
                    {hasRadio(unit) ? "RADIO → CP" : `${primaryKind(unit)} → CP`}
                  </EdgeLabel>
                  <PlatformCard
                    unit={unit}
                    variant="topology"
                    compact
                    selected={selectedVehicleId === unit.id}
                    {...(unit.id === relays[0]?.id
                      ? { camera: false }
                      : {
                          onSelect: () =>
                            onSelectVehicle?.(selectedVehicleId === unit.id ? null : unit.id),
                        })}
                  />
                </MemberColumn>
              );
            })}
          </NodeGrid>
        </TopologyColumnStack>
      </TopologyContent>
    </TopologyRoot>
  );
}
