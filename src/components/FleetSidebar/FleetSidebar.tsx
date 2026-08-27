import ChevronsLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import ChevronsRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { QualityBar } from "@/components/GLOBAL/QualityBar";
import { SectionHeader } from "@/components/GLOBAL/SectionHeader";
import { SidePanel } from "@/components/GLOBAL/SidePanel";
import { parseRate, rateStatus } from "@/lib/linkStatus";
import { MeshMatrix } from "@/components/MeshMatrix";
import { platforms, relays } from "@/data/network";
import {
  CollapseIconButton,
  CollapsedRail,
  GrowCell,
  KindCell,
  ListBody,
  ListHeadRow,
  ListRow,
  NameCell,
  RailLabel,
  RateCell,
  SidebarHeader,
  SidebarTitle,
} from "./FleetSidebar.styles";

export interface FleetSidebarProps {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Platform currently shown in the control room panel. */
  selectedVehicleId?: string | null;
  onSelectVehicle?: (id: string | null) => void;
}

export function FleetSidebar({
  title,
  open,
  onOpenChange,
  selectedVehicleId = null,
  onSelectVehicle,
}: FleetSidebarProps) {
  if (!open) {
    return (
      <CollapsedRail onClick={() => onOpenChange(true)} aria-label="Expand panel">
        <ChevronsRightIcon fontSize="small" />
        <RailLabel>{title}</RailLabel>
      </CollapsedRail>
    );
  }

  return (
    <SidePanel
      side="left"
      width={260}
      header={
        <SidebarHeader>
          <SidebarTitle component="h1">{title}</SidebarTitle>
          <CollapseIconButton
            size="small"
            onClick={() => onOpenChange(false)}
            aria-label="Collapse panel"
          >
            <ChevronsLeftIcon />
          </CollapseIconButton>
        </SidebarHeader>
      }
    >
      <SectionHeader title="Vehicles" />
      <ListBody>
        <ListHeadRow>
          <NameCell>Platform</NameCell>
          <KindCell>Range</KindCell>
          <GrowCell>Quality</GrowCell>
          <RateCell width={34}></RateCell>
          <RateCell>Down</RateCell>
        </ListHeadRow>
        {platforms.map((unit) => (
          <ListRow
            key={unit.id}
            selectable
            selected={selectedVehicleId === unit.id}
            role="button"
            aria-label={`Select ${unit.label}`}
            onClick={() =>
              onSelectVehicle?.(selectedVehicleId === unit.id ? null : unit.id)
            }
          >
            <NameCell>{unit.label}</NameCell>
            <KindCell>{(unit.activeLinks ?? [unit.link]).join(" + ")}</KindCell>
            <GrowCell>
              <QualityBar value={unit.quality} ariaLabel={`${unit.label} quality`} />
            </GrowCell>
            <RateCell width={34}>{unit.quality}</RateCell>
            <RateCell status={rateStatus(parseRate(unit.mbps))}>{unit.mbps}</RateCell>
          </ListRow>
        ))}
      </ListBody>

      <SectionHeader title="Relays" />
      <ListBody>
        <ListHeadRow>
          <NameCell>Relay</NameCell>
          <KindCell>Range</KindCell>
          <GrowCell>Quality</GrowCell>
          <RateCell width={34}></RateCell>
          <RateCell>Down</RateCell>
        </ListHeadRow>
        {relays.map((relay) => (
          <ListRow key={relay.id}>
            <NameCell>{relay.label}</NameCell>
            <KindCell>{relay.link}</KindCell>
            <GrowCell>
              <QualityBar value={relay.quality} ariaLabel={`${relay.label} quality`} />
            </GrowCell>
            <RateCell width={34}>{relay.quality}</RateCell>
            <RateCell status={rateStatus(parseRate(relay.mbps))}>{relay.mbps}</RateCell>
          </ListRow>
        ))}
      </ListBody>

      <SectionHeader title="Link Matrix" />
      <MeshMatrix />
    </SidePanel>
  );
}
