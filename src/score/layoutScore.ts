import { Score } from '@/score';
import { Renderable, noteToRenderable } from '@/renderables';

export function layoutScore(score: Score): Renderable[] {
  const renderables: Renderable[] = [];
  let x = 50;
  const y = 100;
  const spacing = 50;

  for (const measure of score.measures) {
    for (const note of measure.notes) {
      renderables.push(noteToRenderable(note, x, y));
      x += spacing;
    }
    x += spacing * 0.5;
  }

  return renderables;
}
