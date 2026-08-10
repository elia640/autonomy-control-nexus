import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronsLeft, ChevronsRight, Layers, Link2 } from "lucide-react";
import mapImage from "@/assets/map-satellite.jpg";
import { ControlRoomPanel } from "@/components/monitor/ControlRoomPanel";
import { LogicalView } from "@/components/monitor/LogicalView";
import {
  MapOverlay,
  type Status,
  statusColor,
  units,
} from "@/components/monitor/MapOverlay";
import { QualityBar } from "@/components/monitor/QualityBar";

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
  component: Index,
});

const satellites = [
  { name: "TELS-1", down: "15.3", up: "4.2", tone: "text-good" },
  { name: "TELS-2", down: "9.8", up: "2.6", tone: "text-marginal" },
];

function SubHeader({ title }: { title: string }) {
  return (
    <div className="border-y border-border bg-panel-header px-3 py-1.5">
      <span className="panel-title font-semibold text-foreground/80">{title}</span>
    </div>
  );
}

/** Mesh matrix cell values (link margin, dB) keyed by unordered platform pair. */
const meshValues: Record<string, number> = {
  "apc1|utilA": 16,
  "apc1|utilB": 26,
  "apc1|cmd": 28,
  "apc1|tanker": 13,
  "utilA|utilB": 15,
  "utilA|cmd": 15,
  "utilA|tanker": 9,
  "utilB|cmd": 16,
  "utilB|tanker": 6,
  "cmd|tanker": 8,
};

function meshCell(a: string, b: string) {
  if (a === b) return null;
  const v = meshValues[`${a}|${b}`] ?? meshValues[`${b}|${a}`] ?? 10;
  const status: Status = v >= 16 ? "good" : v >= 10 ? "marginal" : "poor";
  return { v, status };
}

function ConnectivityMatrix() {
  return (
    <div className="px-2 py-2">
      <div className="overflow-hidden rounded-[3px] border border-border">
        <table className="w-full border-collapse text-[9px]">
          <thead>
            <tr>
              <th className="w-9 border border-border/80 bg-panel-header p-0" />
              {units.map((u) => (
                <th
                  key={u.id}
                  className="border border-border/80 bg-panel-header px-1 py-1 text-center font-normal tracking-wider text-muted-foreground"
                >
                  P{u.label.split(" ")[1]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {units.map((r) => (
              <tr key={r.id}>
                <td className="border border-border/80 bg-panel-header px-1 py-1 text-left tracking-wider text-muted-foreground">
                  P{r.label.split(" ")[1]}
                </td>
                {units.map((c) => {
                  const cell = meshCell(r.id, c.id);
                  return (
                    <td
                      key={c.id}
                      className="border border-border/80 p-0 text-center font-semibold"
                      style={{
                        background: cell ? statusColor[cell.status] : "transparent",
                        color: cell ? "hsl(0 0% 8%)" : "var(--muted-foreground)",
                      }}
                      title={`${r.label} ↔ ${c.label}: ${cell ? `${cell.v} dB` : "self"}`}
                    >
                      <div className="flex h-5 items-center justify-center">
                        {cell ? cell.v : <span className="opacity-50">—</span>}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-1.5 flex items-center justify-between rounded-[3px] border border-border bg-panel-header px-1.5 py-1 text-[9px]">
        <span className="uppercase tracking-wider text-muted-foreground">Frequency</span>
        <span className="tracking-wider text-foreground">MESH-A · 2.412 GHz</span>
      </div>

      <div className="mt-1.5 flex items-center gap-2 text-[9px] text-muted-foreground">
        {(["good", "marginal", "poor"] as const).map((s) => (
          <span key={s} className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-[2px]" style={{ background: statusColor[s] }} />
            <span className="uppercase tracking-wider">{s}</span>
          </span>
        ))}
      </div>
    </div>
  );
}



function Index() {
  const [linksOn, setLinksOn] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mode, setMode] = useState<"tactical" | "logical">("tactical");


  return (
    <main className="flex h-screen w-full overflow-hidden bg-background">
      {sidebarOpen ? (
        <aside className="flex w-[260px] shrink-0 flex-col overflow-y-auto border-r border-border bg-panel">
          <header className="flex items-center gap-2 border-b-2 border-primary/50 bg-panel-header px-3 py-3">
            <h1 className="flex-1 text-[13px] font-bold tracking-[0.2em] text-primary">
              COMMS NETWORK MONITOR
            </h1>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Collapse panel"
              className="rounded-sm border border-border p-1 text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
            >
              <ChevronsLeft className="h-3.5 w-3.5" />
            </button>
          </header>

          <SubHeader title="Networked Vehicles" />
          <div className="px-3 py-2 text-[10px]">
            <div className="flex items-center gap-2 pb-1 text-[9px] uppercase tracking-wider text-muted-foreground">
              <span className="w-[62px]">Platform</span>
              <span className="w-[52px]">Range</span>
              <span className="flex-1">Quality</span>
              <span className="w-11 text-right">Down</span>
            </div>
            {units.map((u) => (
              <div key={u.id} className="flex items-center gap-2 py-1">
                <span className="w-[62px] truncate text-foreground">{u.label}</span>
                <span className="w-[52px] text-muted-foreground">{u.link}</span>
                <span className="flex-1">
                  <QualityBar value={u.quality} />
                </span>
                <span className="w-11 text-right text-muted-foreground">{u.mbps}</span>
              </div>
            ))}
          </div>

          <SubHeader title="Satellite Link" />
          <div className="px-3 py-2 text-[10px]">
            <div className="flex items-center gap-2 pb-1 text-[9px] uppercase tracking-wider text-muted-foreground">
              <span className="flex-1">Satellite</span>
              <span className="w-14 text-right">Down</span>
              <span className="w-14 text-right">Up</span>
            </div>
            {satellites.map((s) => (
              <div key={s.name} className="flex items-center gap-2 py-1">
                <span className={`flex-1 ${s.tone}`}>{s.name}</span>
                <span className="w-14 text-right text-muted-foreground">{s.down} Mbps</span>
                <span className="w-14 text-right text-muted-foreground">{s.up} Mbps</span>
              </div>
            ))}
          </div>

          <SubHeader title="Link Matrix" />
          <ConnectivityMatrix />
        </aside>
      ) : (
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Expand panel"
          className="flex w-8 shrink-0 flex-col items-center gap-2 border-r border-border bg-panel py-3 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronsRight className="h-4 w-4" />
          <span
            className="text-[9px] tracking-[0.2em] text-primary"
            style={{ writingMode: "vertical-rl" }}
          >
            COMMS NETWORK MONITOR
          </span>
        </button>
      )}

      <div className="relative min-w-0 flex-1">
        {mode === "tactical" ? (
          <>
            <img
              src={mapImage}
              alt="Satellite map of the operating area with vehicle positions"
              width={1280}
              height={960}
              className="h-full w-full object-cover"
            />
            <MapOverlay linksOn={linksOn} />
          </>
        ) : (
          <LogicalView linksOn={linksOn} />
        )}
        <div className="absolute left-1/2 top-3 -translate-x-1/2 text-[11px] tracking-[0.2em] text-foreground/80">
          CIVIL NETWORK MONITORING SYSTEM
        </div>
        <div className="absolute right-3 top-3 flex gap-2 text-[10px]">
          <button
            onClick={() => setLinksOn((v) => !v)}
            aria-pressed={linksOn}
            className={`flex items-center gap-1 rounded-sm px-2 py-1 transition-colors ${
              linksOn
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card/80 text-muted-foreground"
            }`}
          >
            <Link2 className="h-3 w-3" /> LINKS {linksOn ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      <ControlRoomPanel mode={mode} onModeChange={setMode} />
    </main>
  );
}
