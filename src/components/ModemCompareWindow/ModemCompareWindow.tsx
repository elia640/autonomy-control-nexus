import { useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { MonitoringGraph } from "@/components/MonitoringGraph";
import { MAX_BANDWIDTH_MBPS } from "@/data/network";
import type { ThroughputSample } from "@/types/network";
import { CloseButton, HeaderSpacer, WindowHeader, WindowRoot } from "./ModemCompareWindow.styles";

export interface ModemCompareWindowProps {
  title: string;
  samples: ThroughputSample[];
  /** Initial screen position in pixels. */
  initial: { x: number; y: number };
  onClose: () => void;
}

/** Floating monitoring graph used to compare a modem against the selected one. */
export function ModemCompareWindow({ title, samples, initial, onClose }: ModemCompareWindowProps) {
  const [pos, setPos] = useState(initial);
  const drag = useRef<{ dx: number; dy: number } | null>(null);

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (event.button !== 0) return;
    drag.current = { dx: event.clientX - pos.x, dy: event.clientY - pos.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!drag.current) return;
    const x = Math.max(0, Math.min(window.innerWidth - 380, event.clientX - drag.current.dx));
    const y = Math.max(0, Math.min(window.innerHeight - 120, event.clientY - drag.current.dy));
    setPos({ x, y });
  };

  const endDrag = () => {
    drag.current = null;
  };

  return (
    <WindowRoot style={{ left: pos.x, top: pos.y }}>
      <WindowHeader
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {title}
        <HeaderSpacer />
        <CloseButton size="small" aria-label={`Close ${title}`} onClick={onClose}>
          <CloseIcon />
        </CloseButton>
      </WindowHeader>
      <MonitoringGraph samples={samples} maxBandwidth={MAX_BANDWIDTH_MBPS} />
    </WindowRoot>
  );
}
