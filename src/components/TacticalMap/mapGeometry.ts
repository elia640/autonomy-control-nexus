export interface Point {
  x: number;
  y: number;
}

/** Control point for a gentle arc between two points (bow = curvature factor). */
const controlPoint = (from: Point, to: Point, bow: number): Point => {
  const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
  const delta = { x: to.x - from.x, y: to.y - from.y };
  return { x: mid.x - delta.y * bow, y: mid.y + delta.x * bow };
};

export const curvePath = (from: Point, to: Point, bow: number): string => {
  const control = controlPoint(from, to, bow);
  return `M ${from.x} ${from.y} Q ${control.x} ${control.y} ${to.x} ${to.y}`;
};

export const curveMidpoint = (from: Point, to: Point, bow: number): Point => {
  const control = controlPoint(from, to, bow);
  return {
    x: 0.25 * from.x + 0.5 * control.x + 0.25 * to.x,
    y: 0.25 * from.y + 0.5 * control.y + 0.25 * to.y,
  };
};

/** Map-relative percentage position rendered as a tactical grid reference. */
export const formatCoordinates = ({ x, y }: Point): string => {
  const lat = 31.75 + (50 - y) * 0.004;
  const lon = 35.22 + (x - 50) * 0.005;
  const dm = (value: number): string => {
    const deg = Math.floor(Math.abs(value));
    const minutes = (Math.abs(value) - deg) * 60;
    return `${deg}°${minutes.toFixed(1)}'`;
  };
  return `N ${dm(lat)} E ${dm(lon)}`;
};
