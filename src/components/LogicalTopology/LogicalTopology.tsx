import type { ReactNode } from "react";
import { useTheme } from "@mui/material/styles";
import RadioIcon from "@mui/icons-material/SettingsInputAntenna";
import SatelliteIcon from "@mui/icons-material/SatelliteAlt";
import { PlatformCard } from "@/components/PlatformCard";
import { platforms, relays } from "@/data/network";
import type { LinkKind, PlatformUnit } from "@/types/network";
import {
  CommandCaption,
  CommandNode,
  CommandRow,
  Connector,
  HorizontalRule,
  LinkLabel,
  MemberColumn,
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
      <SegmentMembers>
        {members.map((unit) => {
          const color = linksOn ? theme.palette.status[unit.status] : theme.palette.divider;
          return (
            <MemberColumn key={unit.id}>
              <Connector length={14} lineColor={color} />
              <LinkLabel labelColor={color}>
                {(unit.activeLinks ?? [unit.link]).join(" + ")} → CP
              </LinkLabel>
              <Connector length={14} lineColor={color} />
              <PlatformCard unit={unit} variant="topology" />
            </MemberColumn>
          );
        })}
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
          <CommandRow>
            <RadioIcon /> COMMAND POST · GROUND STATION
          </CommandRow>
          <CommandCaption>NETWORK ROOT · ALL PLATFORM LINKS TERMINATE HERE</CommandCaption>
        </CommandNode>
        <Connector length={24} />
        <HorizontalRule />

        {relays.map((relay) => {
          const color = linksOn ? theme.palette.status[relay.status] : theme.palette.divider;
          return (
            <MemberColumn key={relay.id}>
              <SegmentTitle>
                <RadioIcon /> {relay.label} · RADIO RELAY
              </SegmentTitle>
              <Connector length={14} lineColor={color} />
              <LinkLabel labelColor={color}>RADIO → CP</LinkLabel>
              <Connector length={14} lineColor={color} />
              <PlatformCard unit={relay} variant="topology" camera={false} />
            </MemberColumn>
          );
        })}
        <Connector length={24} />
        <HorizontalRule />

        <SegmentGrid>
          {SEGMENTS.map((segment) => {
            const members = platforms.filter((unit) => unit.link === segment.kind);
            return members.length > 0 ? renderSegment(segment, members) : null;
          })}
        </SegmentGrid>
      </TopologyColumnStack>
    </TopologyRoot>
  );
}
