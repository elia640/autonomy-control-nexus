import type { LinkStatus } from "@/theme/tacticalTheme";

export type LinkKind = "CELLULAR" | "SATCOM" | "RADIO";

export type ViewMode = "tactical" | "logical";

export interface SimCard {
  label: string;
  quality: number;
}

export interface SatcomState {
  locked: boolean;
  connected: boolean;
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
  quality: number;
  mbps: string;
  lat: string;
  defaultExpanded?: boolean;
  sims?: SimCard[];
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
  quality: number;
  mbps: string;
  lat: string;
  /** Platform ids the relay serves. */
  connectedTo: string[];
  defaultExpanded?: boolean;
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
}

export type { LinkStatus };
