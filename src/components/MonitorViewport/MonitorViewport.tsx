import LinkIcon from "@mui/icons-material/Link";
import { ConnectivityWheel } from "@/components/ConnectivityWheel";
import { LogicalTopology } from "@/components/LogicalTopology";
import { TacticalMap } from "@/components/TacticalMap";
import type { ViewMode } from "@/types/network";
import { LinksButton, ViewportRoot, ViewportTitle } from "./MonitorViewport.styles";

export interface MonitorViewportProps {
  mode: ViewMode;
  linksOn: boolean;
  onLinksOnChange: (linksOn: boolean) => void;
  title: string;
}

export function MonitorViewport({ mode, linksOn, onLinksOnChange, title }: MonitorViewportProps) {
  return (
    <ViewportRoot>
      {mode === "tactical" ? (
        <TacticalMap linksOn={linksOn} />
      ) : (
        <LogicalTopology linksOn={linksOn} />
      )}

      <ViewportTitle>{title}</ViewportTitle>

      <LinksButton
        active={linksOn}
        size="small"
        startIcon={<LinkIcon />}
        aria-pressed={linksOn}
        onClick={() => onLinksOnChange(!linksOn)}
      >
        Links {linksOn ? "On" : "Off"}
      </LinksButton>

      {/* The connectivity map belongs to the logical view only. */}
      {mode === "logical" && <ConnectivityWheel />}
    </ViewportRoot>
  );
}
