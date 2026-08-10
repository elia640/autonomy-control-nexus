import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Crosshair,
  Lock,
  LockOpen,
  Radio,
  Satellite,
  Truck,
} from "lucide-react";
import { QualityBar } from "./QualityBar";
import { Toggle } from "./Toggle";
import { cn } from "@/lib/utils";

export type Status = "good" | "marginal" | "poor";
export type LinkKind = "CELLULAR" | "SATCOM" | "RADIO";

export const statusColor: Record<Status, string> = {
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

export type Unit = {
  id: string;
  label: string;
  x: number;
  y: number;
  status: Status;
  link: LinkKind;
  quality: number;
  mbps: string;
  lat: string;
  defaultExpanded?: boolean;
  sims?: { label: string; quality: number }[];
  sat?: { locked: boolean; connected: boolean };
};

export const units: Unit[] = [
  {
    id: "apc1",
    label: "PLATFORM 1",
    x: 27,
    y: 33,
    status: "good",
    link: "CELLULAR",
    quality: 82,
    mbps: "47.9",
    lat: "9.7ms",
    defaultExpanded: true,
    sims: [
      { label: "SIM 1", quality: 84 },
      { label: "SIM 2", quality: 61 },
      { label: "SIM 3", quality: 34 },
    ],
  },
  {
    id: "utilA",
    label: "PLATFORM 2",
    x: 68,
    y: 27,
    status: "marginal",
    link: "SATCOM",
    quality: 58,
    mbps: "46.5",
    lat: "120ms",
    defaultExpanded: true,
    sat: { locked: true, connected: true },
  },
  {
    id: "utilB",
    label: "PLATFORM 3",
    x: 80,
    y: 56,
    status: "good",
    link: "CELLULAR",
    quality: 76,
    mbps: "45.9",
    lat: "125ms",
    sims: [
      { label: "SIM 1", quality: 79 },
      { label: "SIM 2", quality: 68 },
      { label: "SIM 3", quality: 41 },
    ],
  },
  {
    id: "cmd",
    label: "PLATFORM 4",
    x: 30,
    y: 76,
    status: "marginal",
    link: "RADIO",
    quality: 52,
    mbps: "44.5",
    lat: "118ms",
  },
  {
    id: "tanker",
    label: "PLATFORM 5",
    x: 62,
    y: 86,
    status: "poor",
    link: "RADIO",
    quality: 21,
    mbps: "25.5",
    lat: "120ms",
  },
];

/** Shared thresholds so every radio quality readout agrees. */
export function statusFromQuality(q: number): Status {
  return q >= 65 ? "good" : q >= 40 ? "marginal" : "poor";
}

export type RadioLink = { from: string; to: string; quality: number; status: Status };

/** Vehicle-to-vehicle (and vehicle-to-command-post) radio mesh links. */
export const radioLinks: RadioLink[] = [
  { from: "apc1", to: "utilA", quality: 78 },
  { from: "utilA", to: "utilB", quality: 55 },
  { from: "cmd", to: "tanker", quality: 24 },
  { from: "apc1", to: "cmd", quality: 71 },
].map((l) => ({ ...l, status: statusFromQuality(l.quality) }));

export const nodeLabel = (id: string) =>
  id === "base" ? "COMMAND POST" : (units.find((u) => u.id === id)?.label ?? id);

/** Radio links that involve a given node. */
export const radioLinksFor = (id: string) =>
  radioLinks.filter((l) => l.from === id || l.to === id);

const byId = (id: string) => units.find((u) => u.id === id)!;


/** Control point for a gentle arc between two points (bow = curvature factor). */
function ctrl(x1: number, y1: number, x2: number, y2: number, bow: number) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  return { cx: mx - dy * bow, cy: my + dx * bow };
}

function curve(x1: number, y1: number, x2: number, y2: number, bow: number) {
  const { cx, cy } = ctrl(x1, y1, x2, y2, bow);
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

function curveMid(x1: number, y1: number, x2: number, y2: number, bow: number) {
  const { cx, cy } = ctrl(x1, y1, x2, y2, bow);
  return { x: 0.25 * x1 + 0.5 * cx + 0.25 * x2, y: 0.25 * y1 + 0.5 * cy + 0.25 * y2 };
}

function UnitCard({ unit }: { unit: Unit }) {
  const [expanded, setExpanded] = useState(!!unit.defaultExpanded);
  const [sims, setSims] = useState([true, true, true]);
  const [satOn, setSatOn] = useState(true);

  return (
    <div className="pointer-events-auto mt-1 w-[132px] rounded-sm border border-border bg-background/90 text-[9px] leading-tight backdrop-blur-sm">
      <div className="flex items-center gap-1 border-b border-border/70 px-1.5 py-1">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-label={`Toggle ${unit.label} details`}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </button>
        <span className="font-semibold tracking-[0.1em] text-foreground">{unit.label}</span>
        <span className={cn("ml-auto tracking-[0.08em]", statusText[unit.status])}>
          {unit.link}
        </span>
      </div>

      <div className="px-1.5 py-1">
        <QualityBar value={unit.quality} />
      </div>

      {expanded && (
        <div className="space-y-1 border-t border-border/70 px-1.5 py-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>{unit.mbps} Mbps</span>
            <span>{unit.lat}</span>
          </div>

          {unit.link === "CELLULAR" && unit.sims && (
            <div className="space-y-1 border-l-2 border-primary/40 pl-1.5">
              {unit.sims.map((s, i) => (
                <div key={s.label} className="flex items-center gap-1.5">
                  <span className="w-8 shrink-0 text-foreground/80">{s.label}</span>
                  <div className="flex-1">
                    <QualityBar value={sims[i] ? s.quality : 0} disabled={!sims[i]} />
                  </div>
                  <Toggle
                    checked={!!sims[i]}
                    onChange={(v) => setSims((p) => p.map((x, j) => (j === i ? v : x)))}
                    label={`${unit.label} ${s.label}`}
                  />
                </div>
              ))}
            </div>
          )}

          {unit.link === "SATCOM" && unit.sat && (
            <div className="space-y-1 border-l-2 border-primary/40 pl-1.5">
              <div className="flex items-center gap-1">
                {unit.sat.locked ? (
                  <Lock className="h-2.5 w-2.5 text-good" />
                ) : (
                  <LockOpen className="h-2.5 w-2.5 text-poor" />
                )}
                <span className={unit.sat.locked ? "text-good" : "text-poor"}>
                  {unit.sat.locked ? "LOCKED" : "NO LOCK"}
                </span>
                <span className="ml-auto text-muted-foreground">
                  {satOn && unit.sat.connected ? "CONNECTED" : "DISCONNECTED"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-8 shrink-0 text-foreground/80">SAT</span>
                <div className="flex-1">
                  <QualityBar value={satOn ? unit.quality : 0} disabled={!satOn} />
                </div>
                <Toggle checked={satOn} onChange={setSatOn} label={`${unit.label} SATCOM`} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function MapOverlay({ linksOn = true }: { linksOn?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* link lines */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="grid" width="6.25" height="6.25" patternUnits="userSpaceOnUse">
            <path
              d="M 6.25 0 L 0 0 0 6.25"
              fill="none"
              stroke="var(--border)"
              strokeWidth="0.08"
              opacity="0.5"
            />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />

        {linksOn && (
          <g>
            {/* ground station <-> platforms: gentle curves with animated flow */}
            {units.map((u) => (
              <g key={u.id}>
                <path
                  d={curve(base.x, base.y, u.x, u.y, 0.12)}
                  fill="none"
                  stroke={statusColor[u.status]}
                  strokeWidth="0.5"
                  opacity="0.12"
                  strokeLinecap="round"
                />
                <path
                  d={curve(base.x, base.y, u.x, u.y, 0.12)}
                  fill="none"
                  stroke={statusColor[u.status]}
                  strokeWidth="0.18"
                  opacity="0.9"
                  strokeLinecap="round"
                />
                <path
                  d={curve(base.x, base.y, u.x, u.y, 0.12)}
                  fill="none"
                  stroke={statusColor[u.status]}
                  strokeWidth="0.32"
                  strokeDasharray="0.6 3"
                  strokeLinecap="round"
                  opacity="0.95"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="7.2"
                    to="0"
                    dur="2.4s"
                    repeatCount="indefinite"
                  />
                </path>
              </g>
            ))}

            {/* inter-platform radio mesh: arced dashed links */}
            {radioLinks.map((l) => {
              const a = byId(l.from);
              const b = byId(l.to);
              return (
                <path
                  key={`${l.from}-${l.to}`}
                  d={curve(a.x, a.y, b.x, b.y, -0.22)}
                  fill="none"
                  stroke={statusColor[l.status]}
                  strokeWidth="0.14"
                  strokeDasharray="1 1.1"
                  strokeLinecap="round"
                  opacity="0.75"
                />
              );
            })}

            {/* satellite uplink */}
            <line
              x1={base.x}
              y1={base.y}
              x2={satellite.x}
              y2={satellite.y}
              stroke="var(--primary)"
              strokeWidth="0.22"
              opacity="0.9"
            />
            <line
              x1={units[1]!.x}
              y1={units[1]!.y}
              x2={satellite.x}
              y2={satellite.y}
              stroke="var(--primary)"
              strokeWidth="0.18"
              opacity="0.7"
            />
          </g>
        )}
      </svg>

      {/* radio mesh midpoint chips */}
      {linksOn &&
        radioLinks.map((l) => {
          const a = byId(l.from);
          const b = byId(l.to);
          const m = curveMid(a.x, a.y, b.x, b.y, -0.22);
          return (
            <div
              key={`chip-${l.from}-${l.to}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-sm border bg-background/85 px-1 py-[1px] text-[8px] tracking-[0.12em] backdrop-blur-sm"
              style={{
                left: `${m.x}%`,
                top: `${m.y}%`,
                borderColor: statusColor[l.status],
                color: statusColor[l.status],
              }}
            >
              RF
            </div>
          );
        })}


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
            <UnitCard unit={u} />
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
        <div className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 border-t border-dashed border-muted-foreground" />
          <span className="uppercase tracking-[0.12em]">radio mesh</span>
        </div>
      </div>

      {/* scale bar */}
      <div className="absolute bottom-3 right-3 text-right text-[9px] tracking-[0.14em] text-muted-foreground">
        <div className="ml-auto h-1 w-20 border-x border-b border-border" />
        <div className="mt-0.5">500 m</div>
      </div>
    </div>
  );
}
