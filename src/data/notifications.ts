export type NotificationSeverity = "good" | "marginal" | "poor";

export interface AlertNotification {
  id: string;
  title: string;
  detail: string;
  time: string;
  severity: NotificationSeverity;
}

/** Static operator alert feed shown in the map notification tray. */
export const notifications: AlertNotification[] = [
  {
    id: "n1",
    title: "PLATFORM 3 · LINK DEGRADED",
    detail: "Radio quality dropped below 40%",
    time: "12:04",
    severity: "poor",
  },
  {
    id: "n2",
    title: "PLATFORM 2 · SIM 2 RECONNECTED",
    detail: "Cellular carrier re-acquired",
    time: "11:58",
    severity: "good",
  },
  {
    id: "n3",
    title: "RELAY · TEMPERATURE WARNING",
    detail: "Modem at 71°C",
    time: "11:41",
    severity: "marginal",
  },
  {
    id: "n4",
    title: "MODEM CONVOY 23 · CPU LOAD",
    detail: "Sustained load above 80%",
    time: "11:22",
    severity: "marginal",
  },
];
