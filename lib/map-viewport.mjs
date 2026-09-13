const MIN_PAN_X = 36;
const MIN_PAN_Y = 24;

const clamp = (value, minimum, maximum) => Math.min(Math.max(value, minimum), maximum);

export function mapPanLimits(width, height, scale) {
  return {
    x: Math.max(MIN_PAN_X, width * (scale - 1) / 2),
    y: Math.max(MIN_PAN_Y, height * (scale - 1) / 2)
  };
}

export function clampMapPan(pan, width, height, scale) {
  const limits = mapPanLimits(width, height, scale);
  return {
    x: clamp(pan.x, -limits.x, limits.x),
    y: clamp(pan.y, -limits.y, limits.y)
  };
}

export function dragMapPan({ origin, delta, viewport, map, scale }) {
  const next = {
    x: origin.x + delta.x * map.width / viewport.width,
    y: origin.y + delta.y * map.height / viewport.height
  };
  return clampMapPan(next, map.width, map.height, scale);
}
