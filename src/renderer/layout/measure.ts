import { Measure } from '@/score/Measure';
import { PositionedItem } from './types';
import { layoutNote, getNoteSpacing } from './note';
import { LayoutContext } from './types';

export const layoutMeasure = (
  measure: Measure,
  x: number,
  y: number,
  ctx: LayoutContext
): PositionedItem[] => {
  const items: PositionedItem[] = [];

  items.push({ item: measure, x, y });

  let currentX = x;
  for (const note of measure.notes) {
    const positionedNote = layoutNote(note, currentX, y);
    items.push(positionedNote);
    currentX += getNoteSpacing(note) + ctx.getNoteWidth(note);
  }

  return items;
};
