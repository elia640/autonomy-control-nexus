import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";

export interface MapViewportState {
  zoom: number;
  x: number;
  y: number;
}

export interface MapViewportApi {
  viewport: MapViewportState;
  panning: boolean;
  reset: () => void;
  zoomBy: (factor: number) => void;
  /** Spread onto the pannable surface. */
  handlers: {
    onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
    onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
    onPointerUp: (event: ReactPointerEvent<HTMLElement>) => void;
  };
}

const MIN_ZOOM = 0.6;
const MAX_ZOOM = 6;
const clamp = (value: number): number => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, value));

/** Cursor-anchored wheel zoom plus pointer panning for a map container. */
export function useMapViewport(containerRef: RefObject<HTMLElement | null>): MapViewportApi {
  const [viewport, setViewport] = useState<MapViewportState>({ zoom: 1, x: 0, y: 0 });
  const [panning, setPanning] = useState(false);
  const origin = useRef<{ px: number; py: number; x: number; y: number } | null>(null);
  const viewportRef = useRef(viewport);
  viewportRef.current = viewport;

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = element.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      const dy = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 100 : 1);
      const current = viewportRef.current;
      const next = clamp(current.zoom * Math.exp(-dy * 0.0018));
      const k = next / current.zoom;
      setViewport({
        zoom: next,
        x: px - (px - current.x) * k,
        y: py - (py - current.y) * k,
      });
    };

    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  }, [containerRef]);

  const zoomBy = useCallback(
    (factor: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      const current = viewportRef.current;
      const px = (rect?.width ?? 0) / 2;
      const py = (rect?.height ?? 0) / 2;
      const next = clamp(current.zoom * factor);
      const k = next / current.zoom;
      setViewport({ zoom: next, x: px - (px - current.x) * k, y: py - (py - current.y) * k });
    },
    [containerRef],
  );

  const reset = useCallback(() => setViewport({ zoom: 1, x: 0, y: 0 }), []);

  return {
    viewport,
    panning,
    reset,
    zoomBy,
    handlers: {
      onPointerDown: (event) => {
        if (event.button !== 0) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        origin.current = {
          px: event.clientX,
          py: event.clientY,
          x: viewportRef.current.x,
          y: viewportRef.current.y,
        };
        setPanning(true);
      },
      onPointerMove: (event) => {
        const start = origin.current;
        if (!start) return;
        setViewport((previous) => ({
          ...previous,
          x: start.x + (event.clientX - start.px),
          y: start.y + (event.clientY - start.py),
        }));
      },
      onPointerUp: (event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
        origin.current = null;
        setPanning(false);
      },
    },
  };
}
