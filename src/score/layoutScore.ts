import { Score } from '@/score';
import {
  Renderable,
  noteToRenderable,
  staffToRenderable,
  measureToRenderable,
} from '@/renderables';

export function layoutScore(score: Score): Renderable[] {
  const renderables: Renderable[] = [];
  let x = 50;
  const y = 100;
  const spacing = 50;

  for (const staff of score.staves) {
    renderables.push(staffToRenderable(staff, x, y));
    for (const measure of staff.measures) {
      renderables.push(measureToRenderable(measure, x, y));
      for (const note of measure.notes) {
        renderables.push(noteToRenderable(note, x, y));
        x += spacing;
      }
      x += spacing * 0.5;
    }
  }

  return renderables;
}
