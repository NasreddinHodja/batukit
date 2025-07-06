import { Glyph } from 'opentype.js';

export type NoteGlyphs = {
  head: Glyph;
  stem: Glyph | null;
  flag: Glyph | null;
  augmentationDots: Glyph[];
  accidental: Glyph | null;
};
