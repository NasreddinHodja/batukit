import {
  NOTE_HEAD_GLYPHS,
  STEM_GLYPHS,
  FLAG_GLYPHS,
  AUGMENTATION_DOT_GLYPH,
  ACCIDENTAL_GLYPHS,
} from '@/utils/glyphs';

type Step = 'c' | 'd' | 'e' | 'f' | 'g' | 'a' | 'b';
type Accidental =
  | '' // none
  | '#' // sharp
  | 'x' // double sharp
  | '#x' // triple sharp
  | '##' // sharp sharp
  | 'b' // flat
  | 'bb' // double flat
  | 'bbb' // triple flat
  | 'n' // natural
  | 'nb' // natural flat
  | 'n#'; // natural sharp
type Octave = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type Pitch = `${Step}${Accidental}/${Octave}`;

export type Duration = 1 | 2 | 4 | 8 | 16 | 32 | 64;

export type NoteHead = keyof typeof NOTE_HEAD_GLYPHS;
export type Stem = keyof typeof STEM_GLYPHS;
export type Flag = keyof typeof FLAG_GLYPHS;

export type StemDirection = 'up' | 'down';

export type AugmentationDot = 0 | 1 | 2 | 3;

export type NoteGlyphIndices = {
  head: number;
  stem: number | null;
  flag: number | null;
  augmentationDots: number[];
  accidental: number | null;
};

export type NoteOptions = {
  pitch: Pitch;
  duration: Duration;
  augmentationDots: AugmentationDot;
  noteHead: NoteHead;
  stemDirection: StemDirection;
  size: number;
  accidental: Accidental;
};

const defaultNoteOptions: NoteOptions = {
  pitch: 'e/5',
  duration: 4,
  augmentationDots: 0,
  accidental: '',
  noteHead: 'black',
  stemDirection: 'up',
  size: 48,
};

export class Note {
  pitch: Pitch;
  duration: Duration;
  augmentationDots: AugmentationDot;
  accidental: Accidental;
  noteHead: NoteHead;
  stemDirection: StemDirection;
  size: number;

  constructor(options: Partial<NoteOptions>) {
    const opts = { ...defaultNoteOptions, ...options };
    this.pitch = opts.pitch;
    this.duration = opts.duration;
    this.augmentationDots = opts.augmentationDots;
    this.accidental = opts.accidental;
    this.noteHead = opts.noteHead;
    this.stemDirection = opts.stemDirection;
    this.size = opts.size;
  }

  with(overrides: Partial<NoteOptions>): Note {
    return new Note({ ...this, ...overrides });
  }

  toString(): string {
    return `${this.pitch}:1/${this.duration}`;
  }

  toGlyphIndices(): NoteGlyphIndices {
    return getNoteGlyphIndices(this);
  }

  hasStem(): boolean {
    return this.duration >= 4;
  }

  hasFlag(): boolean {
    return this.duration >= 8;
  }
}

export const getNoteGlyphIndices = (note: Note): NoteGlyphIndices => {
  const headIndex = NOTE_HEAD_GLYPHS[note.noteHead].index;
  const stemIndex = note.hasStem() ? STEM_GLYPHS.normal.index : null;
  const flagIndex = note.hasFlag()
    ? FLAG_GLYPHS[`${note.stemDirection}${note.duration}` as Flag].index
    : null;

  const augmentationDotIndexes = Array<number>(note.augmentationDots).fill(
    AUGMENTATION_DOT_GLYPH.index
  );

  const accidentalIndexes =
    note.accidental !== '' ? ACCIDENTAL_GLYPHS[note.accidental].index : null;

  return {
    head: headIndex,
    stem: stemIndex,
    flag: flagIndex,
    augmentationDots: augmentationDotIndexes,
    accidental: accidentalIndexes,
  };
};
