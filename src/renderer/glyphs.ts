import { Font } from 'opentype.js';

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

export const glyphNameToIndex = (font: Font, name: string): number => {
  for (let i = 0; i < (font.glyphs.length ?? 0); i++) {
    const glyph = font.glyphs.get(i);
    if (glyph && glyph.name && glyph.name == name) return glyph.index;
  }

  return -1;
};
