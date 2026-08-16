import type { ReactNode } from "react";
import { useTheme } from "@mui/material/styles";
import RadioIcon from "@mui/icons-material/SettingsInputAntenna";
import SatelliteIcon from "@mui/icons-material/SatelliteAlt";
import { PlatformCard } from "@/components/PlatformCard";
import { findPlatform, platforms, radioLinks } from "@/data/network";
import type { LinkKind, PlatformUnit } from "@/types/network";
import {
  CommandNode,
  Connector,
  HorizontalRule,
  MemberColumn,
  MeshLine,
  MeshNodeLabel,
  MeshPanel,
  MeshPanelRow,
  MeshPanelTitle,
  MeshStatusLabel,
  SatelliteNode,
  SegmentColumn,
  SegmentGrid,
  SegmentMembers,
  SegmentTitle,
  TopologyColumnStack,
  TopologyRoot,
} from "./LogicalTopology.styles";

export interface LogicalTopologyProps {
  /** Hides link colouring when false, matching the tactical view. */
  linksOn: boolean;
}

interface Segment {
  kind: LinkKind;
  title: string;
  icon: ReactNode;
}

const SEGMENTS: Segment[] = [
  { kind: "CELLULAR", title: "CELLULAR SEGMENT", icon: <RadioIcon /> },
  { kind: "SATCOM", title: "SATCOM SEGMENT", icon: <SatelliteIcon /> },
  { kind: "RADIO", title: "RADIO SEGMENT", icon: <RadioIcon /> },
];

export function LogicalTopology({ linksOn }: LogicalTopologyProps) {
  const theme = useTheme();

  const renderSegment = (segment: Segment, members: PlatformUnit[]) => (
    <SegmentColumn key={segment.kind}>
      <SegmentTitle>
        {segment.icon} {segment.title}
      </SegmentTitle>
      <Connector length={16} />
      <SegmentMembers>
        {members.map((unit) => (
          <MemberColumn key={unit.id}>
            <Connector
              length={16}
              lineColor={linksOn ? theme.palette.status[unit.status] : theme.palette.divider}
            />
            <PlatformCard unit={unit} variant="topology" />
          </MemberColumn>
        ))}
      </SegmentMembers>
    </SegmentColumn>
  );

  return (
    <TopologyRoot>
      <TopologyColumnStack>
        <SatelliteNode>
          <SatelliteIcon /> TELS-1 SATELLITE
        </SatelliteNode>
        <Connector length={24} lineColor={theme.palette.primary.main} />

        <CommandNode>
          <RadioIcon /> COMMAND POST · GROUND STATION
        </CommandNode>
        <Connector length={24} />
        <HorizontalRule />

        <SegmentGrid>
          {SEGMENTS.map((segment) => {
            const members = platforms.filter((unit) => unit.link === segment.kind);
            return members.length > 0 ? renderSegment(segment, members) : null;
          })}
        </SegmentGrid>

        <MeshPanel>
          <MeshPanelTitle>Inter-platform radio mesh</MeshPanelTitle>
          {radioLinks.map((link) => {
            const from = findPlatform(link.from);
            const to = findPlatform(link.to);
            const color = theme.palette.status[link.status];
            return (
              <MeshPanelRow key={`${link.from}-${link.to}`}>
                <MeshNodeLabel>{from.label}</MeshNodeLabel>
                <MeshLine
                  lineColor={linksOn ? color : theme.palette.divider}
                  dimmed={!linksOn}
                />
                <MeshNodeLabel align="right">{to.label}</MeshNodeLabel>
                <MeshStatusLabel statusColor={color}>{link.status}</MeshStatusLabel>
              </MeshPanelRow>
            );
          })}
        </MeshPanel>
      </TopologyColumnStack>
    </TopologyRoot>
  );
}
