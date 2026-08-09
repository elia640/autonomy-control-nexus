import { Radio, Satellite, Truck, Crosshair } from "lucide-react";

type Status = "good" | "marginal" | "poor";

const statusColor: Record<Status, string> = {
  good: "var(--good)",
  marginal: "var(--marginal)",
  poor: "var(--poor)",
};

const statusText: Record<Status, string> = {
  good: "text-good",
  marginal: "text-marginal",
  poor: "text-poor",
};

/** Percentage-based positions so the overlay scales with the map container. */
const base = { x: 50, y: 62 };
const satellite = { x: 84, y: 12 };

const units: {
  id: string;
  label: string;
  x: number;
  y: number;
  status: Status;
  link: "LTE" | "SATCOM" | "RADIO";
  mbps: string;
  lat: string;
}[] = [
  { id: "apc1", label: "APC-1", x: 27, y: 33, status: "good", link: "LTE", mbps: "47.9", lat: "9.7ms" },
  { id: "utilA", label: "UTILITY A", x: 68, y: 27, status: "marginal", link: "SATCOM", mbps: "46.5", lat: "120ms" },
  { id: "utilB", label: "UTILITY B", x: 78, y: 55, status: "good", link: "LTE", mbps: "45.9", lat: "125ms" },
  { id: "cmd", label: "COMMAND", x: 36, y: 74, status: "marginal", link: "RADIO", mbps: "44.5", lat: "118ms" },
  { id: "tanker", label: "TANKER", x: 62, y: 84, status: "poor", link: "RADIO", mbps: "25.5", lat: "120ms" },
];

export function MapOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* link lines */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="6.25" height="6.25" patternUnits="userSpaceOnUse">
            <path d="M 6.25 0 L 0 0 0 6.25" fill="none" stroke="var(--border)" strokeWidth="0.08" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />

        {units.map((u) => (
          <line
            key={u.id}
            x1={base.x}
            y1={base.y}
            x2={u.x}
            y2={u.y}
            stroke={statusColor[u.status]}
            strokeWidth="0.22"
            strokeDasharray={u.status === "poor" ? "1.2 1" : undefined}
            opacity="0.85"
          />
        ))}

        {/* satellite uplink */}
        <line
          x1={base.x}
          y1={base.y}
          x2={satellite.x}
          y2={satellite.y}
          stroke="var(--primary)"
          strokeWidth="0.22"
          strokeDasharray="1.6 1.2"
          opacity="0.9"
        />
        <line
          x1={units[1]!.x}
          y1={units[1]!.y}
          x2={satellite.x}
          y2={satellite.y}
          stroke="var(--primary)"
          strokeWidth="0.18"
          strokeDasharray="1.6 1.2"
          opacity="0.6"
        />
      </svg>

      {/* base station */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${base.x}%`, top: `${base.y}%` }}
      >
        <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-primary bg-background/70">
          <span className="absolute inset-0 animate-ping rounded-full border border-primary/40" />
          <Radio className="h-4 w-4 text-primary" />
        </div>
        <div className="mt-1 whitespace-nowrap rounded-sm border border-border bg-background/80 px-1.5 py-0.5 text-center text-[9px] tracking-[0.14em] text-primary">
          GROUND STATION
        </div>
      </div>

      {/* satellite */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
        style={{ left: `${satellite.x}%`, top: `${satellite.y}%` }}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-primary/70 bg-background/70">
          <Satellite className="h-4 w-4 text-primary" />
        </div>
        <div className="mt-1 whitespace-nowrap rounded-sm border border-border bg-background/80 px-1.5 py-0.5 text-[9px] tracking-[0.14em] text-primary">
          TELS-1
        </div>
      </div>

      {/* vehicles */}
      {units.map((u) => (
        <div
          key={u.id}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${u.x}%`, top: `${u.y}%` }}
        >
          <div className="flex flex-col items-center">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-sm border bg-background/75"
              style={{ borderColor: statusColor[u.status] }}
            >
              <Truck className="h-3.5 w-3.5" style={{ color: statusColor[u.status] }} />
            </div>
            <div className="mt-1 min-w-[86px] rounded-sm border border-border bg-background/85 px-1.5 py-1 text-[9px] leading-tight">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold tracking-[0.1em] text-foreground">{u.label}</span>
                <span className={statusText[u.status]}>{u.link}</span>
              </div>
              <div className="flex items-center justify-between gap-2 text-muted-foreground">
                <span>{u.mbps} Mbps</span>
                <span>{u.lat}</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* crosshair / north */}
      <div className="absolute left-3 top-3 flex items-center gap-1 rounded-sm border border-border bg-background/70 px-1.5 py-1 text-[9px] tracking-[0.16em] text-muted-foreground">
        <Crosshair className="h-3 w-3 text-primary" /> N 31°46.2' E 035°13.7'
      </div>

      {/* legend */}
      <div className="absolute bottom-3 left-3 space-y-1 rounded-sm border border-border bg-background/80 px-2 py-1.5 text-[9px] text-muted-foreground">
        {(["good", "marginal", "poor"] as Status[]).map((s) => (
          <div key={s} className="flex items-center gap-1.5">
            <span className="h-0.5 w-4" style={{ background: statusColor[s] }} />
            <span className="uppercase tracking-[0.12em]">{s} link</span>
          </div>
        ))}
      </div>

      {/* scale bar */}
      <div className="absolute bottom-3 right-3 text-right text-[9px] tracking-[0.14em] text-muted-foreground">
        <div className="ml-auto h-1 w-20 border-x border-b border-border" />
        <div className="mt-0.5">500 m</div>
      </div>
    </div>
  );
}
