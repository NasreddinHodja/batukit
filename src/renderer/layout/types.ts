import { ScoreItem } from '@/score/types';
import { Note } from '@/score/Note';
import { Glyph, Path } from 'opentype.js';
import { NoteGlyphs } from '../types';

export interface LayoutContext {
  getGlyphPath(glyph: Glyph, x: number, y: number, size: number): Path;
  getNoteGlyphs(note: Note): NoteGlyphs;
  getNoteWidth(note: Note): number;
}

export interface PositionedItem {
  item: ScoreItem;
  x: number;
  y: number;
}
