import { Note } from '@/score/Note';
import { ScoreItem } from '@/score/types';
import { layoutNote } from './note';
import { PositionedItem } from './types';
import { Measure } from '@/score/Measure';
import { layoutMeasure } from './measure';
import { layoutStaff } from './staff';
import { LayoutContext } from './types';
import { Staff } from '@/score/Staff';
import { Score } from '@/score/Score';
import { layoutScore } from './score';

export function layout(
  item: ScoreItem,
  x: number,
  y: number,
  ctx: LayoutContext
): PositionedItem[] {
  if (item instanceof Note) return [layoutNote(item, x, y)];
  if (item instanceof Measure) return layoutMeasure(item, x, y, ctx);
  if (item instanceof Staff) return layoutStaff(item, x, y, ctx);
  if (item instanceof Score) return layoutScore(item, x, y, ctx);

  throw new Error('Unknown layout item');
}
