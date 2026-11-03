import { describe, expect, it } from "vitest";
import { clearOrbitCopy } from "../../../homepage-watch/src/storyOrbitLayout";

const layouts = [
  { field: [1280, 643], card: [132, 109], copy: [590, 297] },
  { field: [1440, 823], card: [180, 143], copy: [660, 355] },
  { field: [1024, 691], card: [132, 109], copy: [560, 272] },
  { field: [850, 573], card: [110, 92], copy: [450, 234] },
];
const tilts = [-3, 2, -2, 3, -1, 2, -3, 2, -1];
type Rect = { x: number; y: number; w: number; h: number };
const overlaps = (a: Rect, b: Rect) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

describe("opening photo clearance", () => {
  it.each(layouts)("keeps all nine rotated cards clear throughout a complete orbit at $field", layout => {
    const [width, height] = layout.field;
    const card = { width: layout.card[0], height: layout.card[1] };
    const copy = { x: width / 2, y: height / 2, width: layout.copy[0], height: layout.copy[1] };
    const copyRect = { x: copy.x - copy.width / 2, y: copy.y - copy.height / 2, w: copy.width, h: copy.height };
    let textCollisions = 0, cardCollisions = 0, clipped = 0;
    for (let phase = 0; phase < 720; phase++) {
      const cards = tilts.map((tilt, index) => {
        const angle = -Math.PI / 2 + index * Math.PI * 2 / 9 + phase * Math.PI / 360;
        const point = clearOrbitCopy({
          x: width / 2 + (width / 2 - card.width / 2 - 28) * Math.cos(angle),
          y: height / 2 + (height / 2 - card.height / 2 - 38) * Math.sin(angle),
        }, copy, card);
        const radians = tilt * Math.PI / 180;
        const w = card.width * Math.cos(radians) + card.height * Math.abs(Math.sin(radians));
        const h = card.height * Math.cos(radians) + card.width * Math.abs(Math.sin(radians));
        const rect = { x: point.x - w / 2, y: point.y - h / 2, w, h };
        if (overlaps(rect, copyRect)) textCollisions++;
        if (rect.x < 0 || rect.y < 0 || rect.x + w > width || rect.y + h > height) clipped++;
        return rect;
      });
      cards.forEach((a, index) => cards.slice(index + 1).forEach(b => {
        if (overlaps(a, b)) cardCollisions++;
      }));
    }
    expect({ textCollisions, cardCollisions, clipped }).toEqual({ textCollisions: 0, cardCollisions: 0, clipped: 0 });
  });
});
