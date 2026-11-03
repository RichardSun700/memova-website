// Ease the original orbit around the central copy, leaving room for each card.
// The rounded boundary avoids abrupt changes as a photo moves past a text corner.
export function clearOrbitCopy(point, copy, card, margin = 28) {
  if (!copy) return point;
  const dx = point.x - copy.x;
  const dy = point.y - copy.y;
  const safeX = copy.width / 2 + card.width / 2 + margin;
  const safeY = copy.height / 2 + card.height / 2 + margin;
  const distance = Math.pow(
    Math.pow(Math.abs(dx) / safeX, 16) +
      Math.pow(Math.abs(dy) / safeY, 16),
    1 / 16,
  );
  if (!distance) return point;
  const required = 1 / distance;
  const scale = (1 + required + Math.hypot(1 - required, 0.02)) / 2;
  return { x: copy.x + dx * scale, y: copy.y + dy * scale };
}
