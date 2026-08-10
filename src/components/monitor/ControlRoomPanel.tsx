import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChevronDown,
  ChevronRight,
  Cpu,
  Play,
  Radio,
  Satellite,
  Settings,
  Thermometer,
} from "lucide-react";
import { Toggle } from "./Toggle";
import { QualityBar } from "./QualityBar";
import { cn } from "@/lib/utils";

const MAX_BANDWIDTH = 22;

const data = Array.from({ length: 13 }, (_, i) => {
  const t = i * 5;
  return {
    t,
    download: 9 + Math.sin(i / 1.6) * 3.5 + (i % 3),
    upload: 5 + Math.cos(i / 2) * 2,
    bandwidth: 18 + Math.sin(i / 3) * 4,
  };
});

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="border-y border-border bg-panel-header px-3 py-2">
      <span className="panel-title font-semibold text-foreground/80">{title}</span>
    </div>
  );
}

function AssetHeader({
  name,
  icon,
  on,
  onToggle,
  status,
  statusTone = "good",
  temp,
  cpu,
  expandable,
  expanded,
  onExpandToggle,
}: {
  name: string;
  icon: React.ReactNode;
  on: boolean;
  onToggle: (v: boolean) => void;
  status: string;
  statusTone?: "good" | "marginal" | "poor";
  temp?: string;
  cpu?: string;
  expandable?: boolean;
  expanded?: boolean;
  onExpandToggle?: () => void;
}) {
  return (
    <div className="rounded-t-sm border border-border bg-card/70 px-2.5 py-2">
      <div className="flex items-center gap-2">
        {expandable && (
          <button
            type="button"
            onClick={onExpandToggle}
            aria-expanded={expanded}
            aria-label={`Toggle ${name} SIM list`}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {expanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
        )}
        <span className="text-primary">{icon}</span>
        <span className="text-[11px] font-semibold tracking-wider text-foreground">{name}</span>
        <span
          className={cn(
            "ml-auto flex items-center gap-1.5 text-[10px] tracking-wider",
            statusTone === "good" && "text-good",
            statusTone === "marginal" && "text-marginal",
            statusTone === "poor" && "text-poor",
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              statusTone === "good" && "bg-good",
              statusTone === "marginal" && "bg-marginal",
              statusTone === "poor" && "bg-poor",
            )}
          />
          {status}
        </span>
        <Toggle checked={on} onChange={onToggle} label={name} />
      </div>
      {(temp || cpu) && (
        <div className="mt-1.5 flex items-center gap-4 text-[10px] text-muted-foreground">
          {temp && (
            <span className="flex items-center gap-1">
              <Thermometer className="h-3 w-3" /> {temp}
            </span>
          )}
          {cpu && (
            <span className="flex items-center gap-1">
              <Cpu className="h-3 w-3" /> CPU {cpu}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function LinkRow({
  label,
  quality,
  rate,
  on,
  onToggle,
}: {
  label: string;
  quality: number;
  rate: string;
  on: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <span className="w-14 shrink-0 text-[11px] tracking-wider text-foreground/85">{label}</span>
      <Toggle checked={on} onChange={onToggle} label={label} />
      <div className="flex-1">
        <QualityBar value={on ? quality : 0} disabled={!on} />
      </div>
      <span
        className={cn(
          "w-[62px] shrink-0 text-right text-[10px]",
          on ? "text-muted-foreground" : "text-muted-foreground/40",
        )}
      >
        {on ? rate : "—"}
      </span>
    </div>
  );
}

function AssetBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-b-sm border border-t-0 border-border bg-card/30 px-2.5 py-1">
      <div className="border-l-2 border-primary/40 pl-2.5">{children}</div>
    </div>
  );
}

export function ControlRoomPanel() {
  const [modemOn, setModemOn] = useState(true);
  const [satOn, setSatOn] = useState(true);
  const [radioOn, setRadioOn] = useState(true);
  const [simsExpanded, setSimsExpanded] = useState(true);
  const [satExpanded, setSatExpanded] = useState(true);
  const [radioExpanded, setRadioExpanded] = useState(true);
  const [sims, setSims] = useState([true, true, true]);
  const [mode, setMode] = useState<"tactical" | "logical">("tactical");
  const [showUpload, setShowUpload] = useState(true);
  const [showDownload, setShowDownload] = useState(true);
  const [showBandwidth, setShowBandwidth] = useState(true);

  return (
    <aside className="flex h-full w-[300px] shrink-0 flex-col border-l border-border bg-panel">
      <header className="border-b border-border bg-panel-header">
        <div className="px-3 py-3 text-center">
          <h1 className="text-[15px] font-bold tracking-[0.24em] text-primary">CONTROL ROOM</h1>
        </div>
        <div className="flex items-center justify-between border-t-2 border-primary/50 bg-card/70 px-3 py-2">
          <p className="text-[11px] font-semibold tracking-[0.24em] text-foreground/90">PRECHECK</p>
          <button className="flex items-center gap-1 rounded-sm bg-primary px-2.5 py-1 text-[10px] font-bold tracking-widest text-primary-foreground transition-opacity hover:opacity-90">
            <Play className="h-2.5 w-2.5" /> RUN
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <SectionHeader title="Network Health" />
        <div className="px-3 py-2.5">
          <p className="mb-1.5 text-[10px] text-muted-foreground">Overall link quality</p>
          <QualityBar value={78} />
          <div className="mt-1 flex justify-between text-[9px] text-muted-foreground">
            <span>Poor</span>
            <span>Marginal</span>
            <span>Good</span>
          </div>
        </div>

        <SectionHeader title="Communication Assets" />
        <div className="space-y-3 px-3 py-2.5">
          <div>
            <AssetHeader
              name="MODEM CM-4200"
              icon={<Radio className="h-3.5 w-3.5" />}
              on={modemOn}
              onToggle={setModemOn}
              status={modemOn ? "OPERATIONAL" : "OFF"}
              statusTone={modemOn ? "good" : "poor"}
              temp="47°C"
              cpu="38%"
              expandable
              expanded={simsExpanded}
              onExpandToggle={() => setSimsExpanded((v) => !v)}
            />
            {simsExpanded && (
              <AssetBody>
                {["SIM 1", "SIM 2", "SIM 3"].map((label, i) => (
                  <LinkRow
                    key={label}
                    label={label}
                    quality={[72, 64, 81][i] ?? 0}
                    rate="12.5 Mbps"
                    on={modemOn && !!sims[i]}
                    onToggle={(v) => setSims((s) => s.map((x, j) => (j === i ? v : x)))}
                  />
                ))}
              </AssetBody>
            )}
          </div>

          <div>
            <AssetHeader
              name="SATCOM MDM-9"
              icon={<Satellite className="h-3.5 w-3.5" />}
              on={satOn}
              onToggle={setSatOn}
              status={satOn ? "SAT LOCKED" : "NO LOCK"}
              statusTone={satOn ? "good" : "poor"}
              temp="52°C"
              cpu="24%"
              expandable
              expanded={satExpanded}
              onExpandToggle={() => setSatExpanded((v) => !v)}
            />
            {satExpanded && (
              <AssetBody>
                <LinkRow
                  label="SATCOM"
                  quality={88}
                  rate="15.3 Mbps"
                  on={satOn}
                  onToggle={setSatOn}
                />
              </AssetBody>
            )}
          </div>

          <div>
            <AssetHeader
              name="RADIO VHF-7"
              icon={<Radio className="h-3.5 w-3.5" />}
              on={radioOn}
              onToggle={setRadioOn}
              status={radioOn ? "OPERATIONAL" : "OFF"}
              statusTone={radioOn ? "good" : "poor"}
              temp="41°C"
              cpu="12%"
              expandable
              expanded={radioExpanded}
              onExpandToggle={() => setRadioExpanded((v) => !v)}
            />
            {radioExpanded && (
              <AssetBody>
                <LinkRow
                  label="RADIO"
                  quality={58}
                  rate="4.8 Mbps"
                  on={radioOn}
                  onToggle={setRadioOn}
                />
              </AssetBody>
            )}
          </div>
        </div>

        <SectionHeader title="Performance Monitoring" />
        <div className="px-2 py-2.5">
          <div className="h-[150px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 6, right: 8, bottom: 14, left: -8 }}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="2 3" />
                <XAxis
                  dataKey="t"
                  type="number"
                  domain={[0, 60]}
                  tick={{ fontSize: 9, fill: "var(--color-muted-foreground)" }}
                  tickLine={{ stroke: "var(--color-border)" }}
                  axisLine={{ stroke: "var(--color-border)" }}
                  ticks={[0, 10, 20, 30, 40, 50, 60]}
                  label={{
                    value: "Seconds",
                    position: "insideBottom",
                    offset: -10,
                    fontSize: 9,
                    fill: "var(--color-muted-foreground)",
                  }}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: "var(--color-muted-foreground)" }}
                  tickLine={{ stroke: "var(--color-border)" }}
                  axisLine={{ stroke: "var(--color-border)" }}
                  ticks={[0, 5, 10, 15, 20, 25]}
                  domain={[0, 25]}
                  label={{
                    value: "Mbps",
                    angle: -90,
                    position: "insideLeft",
                    offset: 16,
                    fontSize: 9,
                    fill: "var(--color-muted-foreground)",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    fontSize: 10,
                  }}
                />
                <ReferenceLine
                  y={MAX_BANDWIDTH}
                  stroke="var(--color-primary)"
                  strokeDasharray="5 4"
                  strokeWidth={1.4}
                  ifOverflow="extendDomain"
                  label={{
                    value: "MAX BW",
                    position: "insideTopRight",
                    fontSize: 8,
                    fill: "var(--color-primary)",
                  }}
                />
                {showUpload && (
                  <Line
                    type="monotone"
                    isAnimationActive={false}
                    dataKey="upload"
                    name="Upload"
                    stroke="var(--color-good)"
                    dot={false}
                    strokeWidth={1.6}
                  />
                )}
                {showDownload && (
                  <Line
                    type="monotone"
                    isAnimationActive={false}
                    dataKey="download"
                    name="Download"
                    stroke="var(--color-marginal)"
                    dot={false}
                    strokeWidth={1.6}
                  />
                )}
                {showBandwidth && (
                  <Line
                    type="monotone"
                    isAnimationActive={false}
                    dataKey="bandwidth"
                    name="Bandwidth"
                    stroke="var(--color-primary)"
                    dot={false}
                    strokeWidth={1.6}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 px-2 text-[10px] text-muted-foreground">
            <label className="flex cursor-pointer items-center gap-1.5">
              <input
                type="checkbox"
                checked={showUpload}
                onChange={(e) => setShowUpload(e.target.checked)}
                className="h-3 w-3 accent-[var(--color-good)]"
              />
              <span className="h-0.5 w-3 bg-[var(--color-good)]" />
              Upload
            </label>
            <label className="flex cursor-pointer items-center gap-1.5">
              <input
                type="checkbox"
                checked={showDownload}
                onChange={(e) => setShowDownload(e.target.checked)}
                className="h-3 w-3 accent-[var(--color-marginal)]"
              />
              <span className="h-0.5 w-3 bg-[var(--color-marginal)]" />
              Download
            </label>
            <label className="flex cursor-pointer items-center gap-1.5">
              <input
                type="checkbox"
                checked={showBandwidth}
                onChange={(e) => setShowBandwidth(e.target.checked)}
                className="h-3 w-3 accent-[var(--color-primary)]"
              />
              <span className="h-0.5 w-3 bg-[var(--color-primary)]" />
              Bandwidth
            </label>
          </div>
        </div>
      </div>

      <footer className="flex items-center gap-2 border-t border-border bg-panel-header px-3 py-2.5">
        <div className="flex flex-1 overflow-hidden rounded-sm border border-border">
          {(["tactical", "logical"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "flex-1 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors",
                mode === m
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {m === "tactical" ? "Tactical" : "Logical"}
            </button>
          ))}
        </div>
        <button
          className="flex items-center gap-1.5 rounded-sm border border-border px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          aria-label="Settings"
        >
          <Settings className="h-3.5 w-3.5" /> Settings
        </button>
      </footer>
    </aside>
  );
}
