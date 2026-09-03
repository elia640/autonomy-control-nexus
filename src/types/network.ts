import type { LinkStatus } from "@/theme/tacticalTheme";

export type LinkKind = "CELLULAR" | "SATCOM" | "RADIO";

export type ViewMode = "tactical" | "logical";

export interface SimCard {
  label: string;
  quality: number;
}

/** Hardware telemetry shared by every modem type. */
export interface ModemHealth {
  /** Hardware identifier, e.g. "MDM-C1". */
  name: string;
  /** Celsius. */
  temperature: number;
  /** Percent; radio modems do not report CPU. */
  cpu?: number;
  /** Volts. */
  voltage: number;
}

/** Satellite RF measurements. */
export interface SatMetrics {
  /** dB */
  sinr: number;
  /** dBW/m2 */
  rsrp: number;
  /** dBm */
  rssi: number;
}

export interface SatcomState {
  locked: boolean;
  connected: boolean;
  metrics?: SatMetrics;
}

/** A secondary communication range served by its own modem. */
export interface ModemLink {
  modem: string;
  kind: LinkKind;
  quality: number;
  mbps: string;
}

export interface PlatformUnit {
  id: string;
  label: string;
  /** Percentage position on the map container. */
  x: number;
  y: number;
  status: LinkStatus;
  link: LinkKind;
  /** All ranges the platform is transmitting on at once (defaults to [link]). */
  activeLinks?: LinkKind[];
  quality: number;
  mbps: string;
  lat: string;
  defaultExpanded?: boolean;
  sims?: SimCard[];
  cellularModem?: ModemHealth;
  satModem?: ModemHealth;
  radioModem?: ModemHealth;
  /** Radio channel shown alongside the modems. */
  radio?: { quality: number; mbps: string };
  sat?: SatcomState;
  /** Additional communication ranges with their own modems. */
  extraLinks?: ModemLink[];
}

/** A communication relay the operator can drag anywhere on the map. */
export interface RelayUnit {
  id: string;
  label: string;
  x: number;
  y: number;
  status: LinkStatus;
  link: LinkKind;
  activeLinks?: LinkKind[];
  quality: number;
  mbps: string;
  lat: string;
  /** Platform ids the relay serves. */
  connectedTo: string[];
  defaultExpanded?: boolean;
  radioModem?: ModemHealth;
  radio?: { quality: number; mbps: string };
  /** Additional communication ranges with their own modems. */
  extraLinks?: ModemLink[];
}


export interface MeshLink {
  from: string;
  to: string;
  status: LinkStatus;
}

export interface SatelliteLink {
  name: string;
  down: string;
  up: string;
  status: LinkStatus;
}

export interface ThroughputSample {
  t: number;
  upload: number;
  download: number;
  bandwidth: number;
  /** Round-trip latency in ms (vehicle modems only). */
  latency?: number;
}

/** Connection state of a modem channel (SIM / satellite service). */
export type ChannelState = "connected" | "disconnected" | "absent" | "unplugged";

export interface ModemChannel {
  id: string;
  label: string;
  state: ChannelState;
  /** 0-100. */
  quality: number;
  /** Mbps. */
  rate: number;
  /** RF readouts shown in a tooltip (satellite channels). */
  metrics?: SatMetrics;
}

/** A modem shown in the right-side control panel. */
export interface ModemAsset {
  id: string;
  name: string;
  quality: number;
  rate: number;
  /** Caption of the rate figure, e.g. "UPLOAD (RX)". */
  rateLabel: string;
  cpuTemperature: number;
  cpuLoad: number;
  channels: ModemChannel[];
}

/** A radio unit shown in the right-side control panel. */
export interface RadioAsset {
  id: string;
  name: string;
  quality: number;
  rate: number;
  rateLabel: string;
  temperature: number;
  voltage: number;
}


/** Display mode for the mesh matrix in the fleet sidebar. */
export type MatrixMetric = "modulation" | "snr" | "rssi";

export type { LinkStatus };
