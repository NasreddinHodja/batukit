import { Font, Glyph } from 'opentype.js';

export const NOTE_HEAD_GLYPHS = {
  null: { index: 159, name: 'uniE0A5' },
  whole: { index: 154, name: 'uniE0A2' },
  black: { index: 158, name: 'uniE0A4' },
  xBlack: { index: 163, name: 'uniE0A9' },
  circleX: { index: 173, name: 'uniE0B3' },
  diamond: { index: 213, name: 'uniE0DB' },
};

export const STEM_GLYPHS = {
  normal: { index: 480, name: 'uniE210' },
};

export const FLAG_GLYPHS = {
  up8: { index: 517, name: 'uniE240' },
  down8: { index: 518, name: 'uniE241' },
  up16: { index: 519, name: 'uniE242' },
  down16: { index: 520, name: 'uniE243' },
  up32: { index: 521, name: 'uniE244' },
  down32: { index: 522, name: 'uniE245' },
  up64: { index: 523, name: 'uniE246' },
  down64: { index: 524, name: 'uniE247' },
};

export const AUGMENTATION_DOT_GLYPH = { index: 472, name: 'uniE1FC' };

export const ACCIDENTAL_GLYPHS = {
  sharp: { index: 537, name: 'uniE262' },
  '#': { index: 537, name: 'uniE262' },
  boubleSharp: { index: 538, name: 'uniE263' },
  x: { index: 538, name: 'uniE263' },
  tripleSharp: { index: 540, name: 'uniE265' },
  '#x': { index: 540, name: 'uniE265' },
  sharpSharp: { index: 544, name: 'uniE269' },
  '##': { index: 544, name: 'uniE269' },

  flat: { index: 535, name: 'uniE260' },
  b: { index: 535, name: 'uniE260' },
  doubleFlat: { index: 539, name: 'uniE264' },
  bb: { index: 539, name: 'uniE264' },
  tripleFlat: { index: 541, name: 'uniE266' },
  bbb: { index: 541, name: 'uniE266' },

  natural: { index: 536, name: 'uniE261' },
  n: { index: 536, name: 'uniE261' },
  naturalFlat: { index: 542, name: 'uniE267' },
  nb: { index: 542, name: 'uniE267' },
  naturalSharp: { index: 543, name: 'uniE268' },
  'n#': { index: 543, name: 'uniE268' },
};

export const glyphNameToIndex = (font: Font, name: string): number => {
  for (let i = 0; i < (font.glyphs.length ?? 0); i++) {
    const glyph = font.glyphs.get(i);
    if (glyph && glyph.name && glyph.name == name) return glyph.index;
  }

  return -1;
};

type GlyphSelector = { name: string; index?: never } | { name?: never; index: number };

export const getGlyph = (font: Font, selector: GlyphSelector): Glyph => {
  if (selector.name !== undefined) {
    const index = glyphNameToIndex(font, selector.name);
    const glyph = font.glyphs.get(index);

    if (!glyph) throw new Error(`Glyph not found for name: ${selector.name}`);

    return glyph;
  } else {
    const glyph = font.glyphs.get(selector.index);

    if (!glyph) throw new Error(`Glyph not found at index: ${selector.index}`);

    return glyph;
  }
};
