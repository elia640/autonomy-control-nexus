import { useState } from "react";
import { Lock, LockOpen, Radio, Satellite, Truck } from "lucide-react";
import { QualityBar } from "./QualityBar";
import { Toggle } from "./Toggle";
import {
  radioLinks,
  statusColor,
  units,
  type Status,
  type Unit,
} from "./MapOverlay";
import { cn } from "@/lib/utils";

const statusText: Record<Status, string> = {
  good: "text-good",
  marginal: "text-marginal",
  poor: "text-poor",
};

function LogicalUnitCard({ unit }: { unit: Unit }) {
  const [sims, setSims] = useState([true, true, true]);
  const [satOn, setSatOn] = useState(true);

  return (
    <div
      className="w-[180px] rounded-sm border bg-card/60 text-[9px] leading-tight"
      style={{ borderColor: statusColor[unit.status] }}
    >
      <div className="flex items-center gap-1.5 border-b border-border/70 bg-panel-header px-1.5 py-1">
        <Truck className="h-3 w-3" style={{ color: statusColor[unit.status] }} />
        <span className="font-semibold tracking-[0.1em] text-foreground">{unit.label}</span>
        <span className={cn("ml-auto tracking-[0.08em]", statusText[unit.status])}>
          {unit.link}
        </span>
      </div>

      <div className="px-1.5 py-1">
        <QualityBar value={unit.quality} />
      </div>

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
              <Toggle checked={satOn} onChange={setSatOn} label={`${unit.label} SATCOM`} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function GroupColumn({
  title,
  icon,
  members,
  linksOn,
}: {
  title: string;
  icon: React.ReactNode;
  members: Unit[];
  linksOn: boolean;
}) {
  if (members.length === 0) return null;
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-1.5 rounded-sm border border-border bg-panel-header px-2 py-1 text-[9px] font-semibold tracking-[0.16em] text-primary">
        {icon} {title}
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-start gap-3">
        {members.map((u) => (
          <div key={u.id} className="flex flex-col items-center">
            <div
              className="h-4 w-px"
              style={{ background: linksOn ? statusColor[u.status] : "var(--border)" }}
            />
            <LogicalUnitCard unit={u} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function LogicalView({ linksOn = true }: { linksOn?: boolean }) {
  const groups = [
    {
      title: "CELLULAR SEGMENT",
      icon: <Radio className="h-3 w-3" />,
      members: units.filter((u) => u.link === "CELLULAR"),
    },
    {
      title: "SATCOM SEGMENT",
      icon: <Satellite className="h-3 w-3" />,
      members: units.filter((u) => u.link === "SATCOM"),
    },
    {
      title: "RADIO SEGMENT",
      icon: <Radio className="h-3 w-3" />,
      members: units.filter((u) => u.link === "RADIO"),
    },
  ];

  return (
    <div className="h-full w-full overflow-auto bg-background px-4 pb-6 pt-12">
      <div className="mx-auto flex w-full flex-col items-center">
        {/* satellite tier */}
        <div className="flex items-center gap-2 rounded-sm border border-primary/70 bg-card/70 px-3 py-1.5 text-[10px] tracking-[0.18em] text-primary">
          <Satellite className="h-3.5 w-3.5" /> TELS-1 SATELLITE
        </div>
        <div className="h-6 w-px bg-primary/70" />

        {/* command post tier */}
        <div className="flex items-center gap-2 rounded-sm border-2 border-primary bg-panel-header px-4 py-2 text-[11px] font-bold tracking-[0.2em] text-primary">
          <Radio className="h-4 w-4" /> COMMAND POST · GROUND STATION
        </div>
        <div className="h-6 w-px bg-border" />
        <div className="h-px w-[70%] bg-border" />

        {/* segment tiers */}
        <div className="mt-4 flex flex-wrap items-start justify-center gap-x-8 gap-y-6">
          {groups.map((g) => (
            <GroupColumn key={g.title} {...g} linksOn={linksOn} />
          ))}
        </div>

        {/* radio mesh between platforms */}
        <div className="mt-8 w-full max-w-[560px] rounded-sm border border-border bg-card/40 p-2">
          <div className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Inter-platform radio mesh
          </div>
          <div className="space-y-1">
            {radioLinks.map((l) => {
              const a = units.find((u) => u.id === l.from)!;
              const b = units.find((u) => u.id === l.to)!;
              return (
                <div key={`${l.from}-${l.to}`} className="flex items-center gap-2 text-[9px]">
                  <span className="w-[70px] text-foreground/85">{a.label}</span>
                  <span
                    className="h-0.5 flex-1"
                    style={{
                      background: linksOn ? statusColor[l.status] : "var(--border)",
                      opacity: linksOn ? 1 : 0.4,
                    }}
                  />
                  <span className="w-[70px] text-right text-foreground/85">{b.label}</span>
                  <span className={cn("w-[62px] text-right uppercase", statusText[l.status])}>
                    {l.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
