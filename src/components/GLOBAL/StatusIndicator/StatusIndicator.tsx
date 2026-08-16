import type { LinkStatus } from "@/types/network";
import { StatusDot, StatusRoot } from "./StatusIndicator.styles";

export interface StatusIndicatorProps {
  status: LinkStatus;
  label: string;
  /** Hide the leading dot when the label alone is enough. */
  hideDot?: boolean;
}

export function StatusIndicator({ status, label, hideDot }: StatusIndicatorProps) {
  return (
    <StatusRoot status={status}>
      {!hideDot && <StatusDot status={status} />}
      {label}
    </StatusRoot>
  );
}
