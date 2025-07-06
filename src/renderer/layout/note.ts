import { Path } from 'opentype.js';
import { Note } from '@/score/Note';
import { PositionedItem } from './types';
import { LayoutContext } from './types';

const NOTE_SPACING_SCALER = 50 as const;
const NOTE_SPACING_RATIO = 0.777 as const;

export const getNoteSpacing = (note: Note): number => {
  const timeTicks = getNoteTicks(note);
  const space = NOTE_SPACING_RATIO * NOTE_SPACING_RATIO * Math.sqrt(timeTicks);
  return space * NOTE_SPACING_SCALER;
};

export const getNoteTicks = (note: Note): number => {
  const ticks = 64 / note.duration;
  return ticks + getAugmentedDuration(ticks, note.augmentationDots);
};

export const getAugmentedDuration = (base: number, dots: number): number => {
  const multiplier = 2 * (1 - 1 / 2 ** (dots + 1));
  return base * multiplier;
};

export const layoutNote = (note: Note, x: number, y: number): PositionedItem => ({
  item: note,
  x,
  y,
});

export const buildNoteGlyphLayoutPaths = (
  note: Note,
  startX: number,
  startY: number,
  ctx: LayoutContext
): Path[] => {
  const size = note.size;
  const stemUp = note.stemDirection === 'up';
  const glyphs = ctx.getNoteGlyphs(note);
  const paths: Path[] = [];

  let x = startX;

  if (glyphs.accidental !== null) {
    const path = ctx.getGlyphPath(glyphs.accidental, x, startY, size * 0.8);
    const bbox = path.getBoundingBox();
    const width = Math.abs(bbox.x1 - bbox.x2);
    paths.push(path);
    x += width + size * 0.05;
  }

  if (glyphs.stem !== null) {
    const xOffset = stemUp ? size * 0.27 : size * 0.02;
    const yOffset = stemUp ? 0 : size * 0.875;
    const path = ctx.getGlyphPath(glyphs.stem, x + xOffset, startY + yOffset, size);
    paths.push(path);
  }

  if (glyphs.flag) {
    const xOffset = stemUp ? size * 0.27 : 0;
    const yOffset = stemUp ? -size * 0.8 : size * 0.86;
    const path = ctx.getGlyphPath(glyphs.flag, x + xOffset, startY + yOffset, size);
    paths.push(path);
  }

  paths.push(ctx.getGlyphPath(glyphs.head, x, startY, size));

  if (glyphs.augmentationDots.length > 0) {
    const baseXOffset = size * 0.35;
    const yOffset = size * -0.1;
    let xOffset = baseXOffset;
    glyphs.augmentationDots.forEach((glyph) => {
      const path = ctx.getGlyphPath(glyph, x + xOffset, startY + yOffset, size);
      paths.push(path);
      xOffset += baseXOffset * 0.5;
    });
  }

  return paths;
};

export const getNoteWidth = (note: Note, ctx: LayoutContext): number => {
  const paths = buildNoteGlyphLayoutPaths(note, 0, 0, ctx);

  let minX = Infinity;
  let maxX = -Infinity;

  for (const path of paths) {
    const bbox = path.getBoundingBox();
    minX = Math.min(minX, bbox.x1, bbox.x2);
    maxX = Math.max(maxX, bbox.x1, bbox.x2);
  }

  return maxX - minX;
};
