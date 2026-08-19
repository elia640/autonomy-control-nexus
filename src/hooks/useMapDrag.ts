import { useCallback, useState, type PointerEvent as ReactPointerEvent, type RefObject } from "react";

export interface MapPosition {
  x: number;
  y: number;
}

export interface MapDragApi {
  position: MapPosition;
  dragging: boolean;
  /** Spread onto the draggable element. */
  handlers: {
    onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
    onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
    onPointerUp: (event: ReactPointerEvent<HTMLElement>) => void;
  };
}

/** Percentage-based dragging of a marker inside a map container. */
export function useMapDrag(
  containerRef: RefObject<HTMLElement | null>,
  initial: MapPosition,
): MapDragApi {
  const [position, setPosition] = useState<MapPosition>(initial);
  const [dragging, setDragging] = useState(false);

  const move = useCallback(
    (clientX: number, clientY: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPosition({
        x: Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100)),
        y: Math.max(2, Math.min(98, ((clientY - rect.top) / rect.height) * 100)),
      });
    },
    [containerRef],
  );

  return {
    position,
    dragging,
    handlers: {
      onPointerDown: (event) => {
        // Keep marker drags from panning the map underneath.
        event.stopPropagation();
        event.currentTarget.setPointerCapture(event.pointerId);
        setDragging(true);
      },
      onPointerMove: (event) => {
        if (dragging) event.stopPropagation();
        if (dragging) move(event.clientX, event.clientY);
      },
      onPointerUp: (event) => {
        event.currentTarget.releasePointerCapture(event.pointerId);
        setDragging(false);
      },
    },
  };
}
