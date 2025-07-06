import { Staff } from '@/score/Staff';
import { layoutMeasure } from './measure';
import { PositionedItem, LayoutContext } from './types';
import { getNoteSpacing } from './note';

export function layoutStaff(
  staff: Staff,
  x: number,
  y: number,
  ctx: LayoutContext
): PositionedItem[] {
  const items: PositionedItem[] = [];

  items.push({ item: staff, x, y });

  let currentX = x;

  for (const measure of staff.measures) {
    const measureItems = layoutMeasure(measure, currentX, y, ctx);

    items.push(...measureItems);

    const spacing = measure.notes
      .map((note) => ctx.getNoteWidth(note) + getNoteSpacing(note))
      .reduce((a, b) => a + b, 0);

    currentX += spacing;
  }

  return items;
}
