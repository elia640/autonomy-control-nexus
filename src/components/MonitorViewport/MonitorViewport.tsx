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
  
} from "./MonitorViewport.styles";

export interface MonitorViewportProps {
  mode: ViewMode;
  linksOn: boolean;
  onLinksOnChange: (linksOn: boolean) => void;
  
  selectedVehicleId?: string | null;
  onSelectVehicle?: (id: string | null) => void;
  selectedRelayId?: string | null;
  onSelectRelay?: (id: string | null) => void;
  /** Logical view: clicking the control room swaps the right panel to it. */
  onOpenControlRoom?: () => void;
}

export function MonitorViewport({
  mode,
  linksOn,
  onLinksOnChange,
  
  selectedVehicleId = null,
  onSelectVehicle,
  selectedRelayId = null,
  onSelectRelay,
  onOpenControlRoom,
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
          {...(onOpenControlRoom ? { onOpenControlRoom } : {})}
        />
      )}


      <TopRightBar>
        {/* Mesh links control belongs to the tactical map only. */}
        {mode === "tactical" && (
          <LinksButton
            active={linksOn}
            size="small"
            startIcon={<LinkIcon />}
            aria-pressed={linksOn}
            onClick={() => onLinksOnChange(!linksOn)}
          >
            Mesh Links
          </LinksButton>
        )}

        <TraySlot>
          <NotificationTray />
        </TraySlot>
      </TopRightBar>

      {/* The connectivity map belongs to the logical view only. */}
      {mode === "logical" && <ConnectivityWheel />}
    </ViewportRoot>
  );
}
