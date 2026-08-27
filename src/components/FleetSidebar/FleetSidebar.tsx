import ChevronsLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import ChevronsRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { QualityMeter } from "@/components/GLOBAL/QualityMeter";
import { SectionHeader } from "@/components/GLOBAL/SectionHeader";
import { SidePanel } from "@/components/GLOBAL/SidePanel";
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
  /** Relay currently focused on the tactical map. */
  selectedRelayId?: string | null;
  onSelectRelay?: (id: string | null) => void;
}

export function FleetSidebar({
  title,
  open,
  onOpenChange,
  selectedVehicleId = null,
  onSelectVehicle,
  selectedRelayId = null,
  onSelectRelay,
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
      width={296}
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
              <QualityMeter value={unit.quality} ariaLabel={`${unit.label} quality`} />
            </GrowCell>
          </ListRow>
        ))}
      </ListBody>

      <SectionHeader title="Relays" />
      <ListBody>
        <ListHeadRow>
          <NameCell>Relay</NameCell>
          <KindCell>Range</KindCell>
          <GrowCell>Quality</GrowCell>
        </ListHeadRow>
        {relays.map((relay) => (
          <ListRow
            key={relay.id}
            selectable
            selected={selectedRelayId === relay.id}
            role="button"
            aria-label={`Center map on ${relay.label}`}
            onClick={() => onSelectRelay?.(selectedRelayId === relay.id ? null : relay.id)}
          >
            <NameCell>{relay.label}</NameCell>
            <KindCell>{relay.link}</KindCell>
            <GrowCell>
              <QualityMeter value={relay.quality} ariaLabel={`${relay.label} quality`} />
            </GrowCell>
          </ListRow>
        ))}
      </ListBody>

      <SectionHeader title="Link Matrix" />
      <MeshMatrix />
    </SidePanel>
  );
}
