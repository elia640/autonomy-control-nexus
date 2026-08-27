import LinkIcon from "@mui/icons-material/Link";
import { ConnectivityWheel } from "@/components/ConnectivityWheel";
import { LogicalTopology } from "@/components/LogicalTopology";
import { NotificationTray } from "@/components/NotificationTray";
import { TacticalMap } from "@/components/TacticalMap";
import type { ViewMode } from "@/types/network";
import {
  LinksButton,
  TopRightBar,
  TraySlot,
  ViewportRoot,
  ViewportTitle,
} from "./MonitorViewport.styles";

export interface MonitorViewportProps {
  mode: ViewMode;
  linksOn: boolean;
  onLinksOnChange: (linksOn: boolean) => void;
  title: string;
  selectedVehicleId?: string | null;
  onSelectVehicle?: (id: string | null) => void;
  selectedRelayId?: string | null;
  onSelectRelay?: (id: string | null) => void;
}

export function MonitorViewport({
  mode,
  linksOn,
  onLinksOnChange,
  title,
  selectedVehicleId = null,
  onSelectVehicle,
  selectedRelayId = null,
  onSelectRelay,
}: MonitorViewportProps) {
  return (
    <ViewportRoot>
      {mode === "tactical" ? (
        <TacticalMap
          linksOn={linksOn}
          selectedVehicleId={selectedVehicleId}
          selectedRelayId={selectedRelayId}
          {...(onSelectVehicle ? { onSelectVehicle } : {})}
          {...(onSelectRelay ? { onSelectRelay } : {})}
        />
      ) : (
        <LogicalTopology
          linksOn={linksOn}
          selectedVehicleId={selectedVehicleId}
          {...(onSelectVehicle ? { onSelectVehicle } : {})}
        />
      )}

      <ViewportTitle>{title}</ViewportTitle>

      <TopRightBar>
        <LinksButton
          active={linksOn}
          size="small"
          startIcon={<LinkIcon />}
          aria-pressed={linksOn}
          onClick={() => onLinksOnChange(!linksOn)}
        >
          Links {linksOn ? "On" : "Off"}
        </LinksButton>
        <TraySlot>
          <NotificationTray />
        </TraySlot>
      </TopRightBar>

      {/* The connectivity map belongs to the logical view only. */}
      {mode === "logical" && <ConnectivityWheel />}
    </ViewportRoot>
  );
}
