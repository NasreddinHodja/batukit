import { Score } from '@/score/Score';
import { PositionedItem } from './types';
import { layoutStaff } from './staff';
import { LayoutContext } from './types';

export const layoutScore = (
  score: Score,
  x: number,
  y: number,
  ctx: LayoutContext
): PositionedItem[] => {
  const items: PositionedItem[] = [];

  items.push({ item: score, x, y });

  let currentY = y;
  for (const staff of score.staves) {
    const positionedStaff = layoutStaff(staff, x, currentY, ctx);
    items.push(...positionedStaff);
    currentY += 400; // TODO: correct spacing for staves
  }

  return items;
};
