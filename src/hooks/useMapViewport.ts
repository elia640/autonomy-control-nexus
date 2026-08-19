import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
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
    onClickCapture: (event: ReactMouseEvent<HTMLElement>) => void;
  };
}

const MIN_ZOOM = 0.6;
const MAX_ZOOM = 6;
/** Pointer travel (px) before a press turns into a pan instead of a click. */
const DRAG_THRESHOLD = 4;
const INTERACTIVE = 'button,a,input,select,textarea,[role="switch"],[role="button"],[data-no-pan]';

const clamp = (value: number): number => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, value));

/** Cursor-anchored wheel zoom plus left-button pointer panning for a map container. */
export function useMapViewport(containerRef: RefObject<HTMLElement | null>): MapViewportApi {
  const [viewport, setViewport] = useState<MapViewportState>({ zoom: 1, x: 0, y: 0 });
  const [panning, setPanning] = useState(false);
  const origin = useRef<{ px: number; py: number; x: number; y: number } | null>(null);
  const movedRef = useRef(false);
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

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    // Left button only, and never start a pan from a control inside the map.
    if (event.button !== 0 || !(event.buttons & 1)) return;
    if ((event.target as HTMLElement).closest(INTERACTIVE)) return;

    origin.current = {
      px: event.clientX,
      py: event.clientY,
      x: viewportRef.current.x,
      y: viewportRef.current.y,
    };
    movedRef.current = false;

    const onMove = (move: PointerEvent) => {
      const start = origin.current;
      if (!start) return;
      // Releasing outside the window can drop pointerup: stop when no button is held.
      if (!(move.buttons & 1)) {
        stop();
        return;
      }
      const dx = move.clientX - start.px;
      const dy = move.clientY - start.py;
      if (!movedRef.current && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      movedRef.current = true;
      setPanning(true);
      setViewport((previous) => ({ ...previous, x: start.x + dx, y: start.y + dy }));
    };

    const stop = () => {
      origin.current = null;
      setPanning(false);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
  }, []);

  const onClickCapture = useCallback((event: ReactMouseEvent<HTMLElement>) => {
    // Swallow the click that ends a pan so cards don't toggle open/closed.
    if (movedRef.current) {
      movedRef.current = false;
      event.preventDefault();
      event.stopPropagation();
    }
  }, []);

  return { viewport, panning, reset, zoomBy, handlers: { onPointerDown, onClickCapture } };
}
