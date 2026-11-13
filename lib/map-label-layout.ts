export type MapRect = { x: number; y: number; width: number; height: number };
export type MapLabel = { id: number; x: number; y: number; width: number; height: number; priority: number; west: boolean };
export type PlacedMapLabel = MapLabel & { left: number; top: number; slot: number };

const overlaps = (a: MapRect, b: MapRect, gap = 7) =>
  a.x < b.x + b.width + gap && a.x + a.width + gap > b.x &&
  a.y < b.y + b.height + gap && a.y + a.height + gap > b.y;

// Lay out screen-space captions independently of their geographic anchors.
// The current base gets first choice; nearby places keep their dots if space is tight.
export function layoutMapLabels(labels: MapLabel[], bounds: MapRect, obstacles: MapRect[], previous: Map<number, number> = new Map()): PlacedMapLabel[] {
  const occupied = [...obstacles];
  const dots = labels.map(label => ({ x: label.x - 7, y: label.y - 7, width: 14, height: 14 }));
  const placed: PlacedMapLabel[] = [];
  for (const label of [...labels].sort((a, b) => b.priority - a.priority || a.id - b.id)) {
    const candidates = [0, -36, 36, -72, 72, -108, 108, -144, 144].flatMap((offset, row) =>
      [label.west, !label.west].map((west, side) => ({
        x: west ? label.x - 21 - label.width : label.x + 21,
        y: label.y - label.height / 2 + offset,
        width: label.width, height: label.height, slot: row * 2 + side,
        score: Math.abs(offset) + side * 12 - (previous.get(label.id) === row * 2 + side ? 24 : 0),
      })));
    for (const [row, offset] of [22, 58, 94, 130, 166].entries()) {
      for (const [side, above] of [true, false].entries()) {
        const slot = 18 + row * 2 + side;
        candidates.push({
          x: Math.max(bounds.x, Math.min(label.x - label.width / 2, bounds.x + bounds.width - label.width)),
          y: above ? label.y - offset - label.height : label.y + offset,
          width: label.width, height: label.height, slot,
          score: offset + label.height / 2 + 12 - (previous.get(label.id) === slot ? 24 : 0),
        });
      }
    }
    const candidate = candidates.sort((a, b) => a.score - b.score).find(rect =>
      rect.x >= bounds.x && rect.y >= bounds.y &&
      rect.x + rect.width <= bounds.x + bounds.width && rect.y + rect.height <= bounds.y + bounds.height &&
      !occupied.some(other => overlaps(rect, other)) && !dots.some(dot => overlaps(rect, dot, 3)));
    if (!candidate) continue;
    occupied.push(candidate);
    placed.push({ ...label, left: candidate.x, top: candidate.y, slot: candidate.slot });
  }
  return placed;
}
