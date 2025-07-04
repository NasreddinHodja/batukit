import { Note, Score } from '@/score';
import {
  Renderable,
  noteToRenderable,
  staffToRenderable,
  measureToRenderable,
} from '@/renderables';

export const layoutScore = (score: Score): Renderable[] => {
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
        x += getNoteSpacing(note);
      }
      x += spacing * 0.5;
    }
  }

  return renderables;
};

const NOTE_SPACING_SCALER = 50 as const;
const NOTE_SPACING_RATIO = 0.777 as const;

const getNoteSpacing = (note: Note): number => {
  const timeTicks = getNoteTicks(note);
  const space = NOTE_SPACING_RATIO * NOTE_SPACING_RATIO * Math.sqrt(timeTicks);
  return space * NOTE_SPACING_SCALER;
};

const getNoteTicks = (note: Note): number => {
  const ticks = 64 / note.duration;
  return ticks + (note.options.dotted ? ticks / 2 : 0);
};
