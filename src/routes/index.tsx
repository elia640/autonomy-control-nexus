import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ControlRoomPanel } from "@/components/ControlRoomPanel";
import { FleetSidebar } from "@/components/FleetSidebar";
import { MonitorLayout } from "@/components/MonitorLayout";
import { MonitorViewport } from "@/components/MonitorViewport";
import type { ViewMode } from "@/types/network";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Comms Network Monitor — Autonomous Fleet Control Room" },
      {
        name: "description",
        content:
          "Operator console for monitoring link quality, modems, SATCOM and radio across a remotely operated autonomous vehicle fleet.",
      },
      { property: "og:title", content: "Comms Network Monitor — Control Room" },
      {
        property: "og:description",
        content:
          "Live link quality, modem health and throughput for remotely operated autonomous vehicles.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MonitorPage,
});

function MonitorPage() {
  const [linksOn, setLinksOn] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mode, setMode] = useState<ViewMode>("tactical");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  return (
    <MonitorLayout>
      <FleetSidebar
        title="COMMS NETWORK MONITOR"
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        selectedVehicleId={selectedVehicleId}
        onSelectVehicle={setSelectedVehicleId}
      />
      <MonitorViewport
        mode={mode}
        linksOn={linksOn}
        onLinksOnChange={setLinksOn}
        title="CIVIL NETWORK MONITORING SYSTEM"
      />
      <ControlRoomPanel
        mode={mode}
        onModeChange={setMode}
        selectedVehicleId={selectedVehicleId}
        onSelectVehicle={setSelectedVehicleId}
      />

    </MonitorLayout>
  );
}
