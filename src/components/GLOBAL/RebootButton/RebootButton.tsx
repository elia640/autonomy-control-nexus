import { useEffect, useRef, useState } from "react";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { RebootLabel, RebootRoot } from "./RebootButton.styles";

export interface RebootButtonProps {
  /** Reboot duration in seconds. Defaults to 10. */
  seconds?: number;
  /** Fired when the operator starts the reboot. */
  onStart?: () => void;
  /** Fired once the cycle completes and controls unlock. */
  onComplete?: () => void;
  /** Reports the in-progress state so callers can lock their controls. */
  onRebootingChange?: (rebooting: boolean) => void;
  label?: string;
}

/** REBOOT control with an in-place countdown for the restart cycle. */
export function RebootButton({
  seconds = 10,
  onStart,
  onComplete,
  onRebootingChange,
  label = "Reboot",
}: RebootButtonProps) {
  const [remaining, setRemaining] = useState(0);
  const rebooting = remaining > 0;
  const completeRef = useRef(onComplete);
  const changeRef = useRef(onRebootingChange);
  completeRef.current = onComplete;
  changeRef.current = onRebootingChange;

  useEffect(() => {
    if (!rebooting) return;
    const timer = window.setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          window.clearInterval(timer);
          changeRef.current?.(false);
          completeRef.current?.();
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [rebooting]);

  const start = () => {
    if (rebooting) return;
    setRemaining(seconds);
    onRebootingChange?.(true);
    onStart?.();
  };

  const progress = rebooting ? ((seconds - remaining) / seconds) * 100 : 0;

  return (
    <RebootRoot
      variant="outlined"
      size="small"
      progress={progress}
      disabled={rebooting}
      onClick={start}
      aria-label={label}
      aria-busy={rebooting}
    >
      <RebootLabel>
        <PowerSettingsNewIcon />
        {rebooting ? `REBOOTING ${remaining}s` : "REBOOT"}
      </RebootLabel>
    </RebootRoot>
  );
}
