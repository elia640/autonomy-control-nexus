import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Layers, Link2 } from "lucide-react";
import mapImage from "@/assets/map-satellite.jpg";
import { ControlRoomPanel } from "@/components/monitor/ControlRoomPanel";
import { MapOverlay } from "@/components/monitor/MapOverlay";

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

const vehicles = [
  { name: "APC-1", mbps: "47.9", lat: "9.7ms", color: "bg-primary" },
  { name: "Utility A", mbps: "46.5", lat: "120ms", color: "bg-marginal" },
  { name: "Utility B", mbps: "45.9", lat: "125ms", color: "bg-good" },
  { name: "Command", mbps: "44.5", lat: "118ms", color: "bg-marginal" },
  { name: "Tanker", mbps: "25.5", lat: "120ms", color: "bg-poor" },
];

function Section({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center justify-between border-y border-border bg-panel-header px-3 py-2">
        <span className="panel-title font-semibold text-foreground/80">{title}</span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="px-3 py-2.5 text-[11px]">{children}</div>
    </section>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className={tone ?? "text-foreground"}>{value}</span>
    </div>
  );
}

function Index() {
  const [linksOn, setLinksOn] = useState(true);

  return (
    <main className="flex h-screen w-full overflow-hidden bg-background">
      <aside className="flex w-[220px] shrink-0 flex-col overflow-y-auto border-r border-border bg-panel">
        <header className="border-b border-border bg-panel-header px-3 py-2.5">
          <h2 className="text-[11px] font-bold tracking-[0.18em] text-foreground">
            COMMS NETWORK MONITOR
          </h2>
        </header>
        <Section title="General">
          <Row label="Operation" value="ROAM-04 / Ridge West" />
          <Row label="Mode" value="Auto-select carrier" />
          <Row label="Encryption" value="AES-256 · active" />
          <Row label="Uptime" value="04:12:38" />
        </Section>
        <Section title="Satellite Link">
          <Row label="SINR" value="+18.5 dB" tone="text-primary" />
          <Row label="RSRP" value="−28 dBm" tone="text-primary" />
          <Row label="RSSI" value="−117 dBm" tone="text-primary" />
          <Row label="Sat" value="TELS-1" />
        </Section>
        <Section title="Vehicles">
          {vehicles.map((v) => (
            <div key={v.name} className="flex items-center gap-2 py-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${v.color}`} />
              <span className="flex-1 text-foreground">{v.name}</span>
              <span className="text-muted-foreground">{v.mbps}</span>
              <span className="w-12 text-right text-muted-foreground">{v.lat}</span>
            </div>
          ))}
        </Section>
      </aside>

      <div className="relative min-w-0 flex-1">
        <img
          src={mapImage}
          alt="Satellite map of the operating area with vehicle positions"
          width={1280}
          height={960}
          className="h-full w-full object-cover"
        />
        <MapOverlay linksOn={linksOn} />
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
          <button className="flex items-center gap-1 rounded-sm border border-border bg-card/80 px-2 py-1">
            <Layers className="h-3 w-3" /> LAYERS
          </button>
        </div>
      </div>

      <ControlRoomPanel />
    </main>
  );
}
