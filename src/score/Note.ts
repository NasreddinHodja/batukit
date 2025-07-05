import { NOTE_HEAD_GLYPHS, STEM_GLYPHS, FLAG_GLYPHS, AUGMENTATION_DOT_GLYPH } from '@/renderer';

type Step = 'c' | 'd' | 'e' | 'f' | 'g' | 'a' | 'b';
type Accidental = '' | '#' | 'b' | '##' | 'bb' | 'n';
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
};

type NoteOptions = {
  pitch: Pitch;
  duration: Duration;
  augmentationDots: AugmentationDot;
  noteHead: NoteHead;
  stemDirection: StemDirection;
  size: number;
};

const defaultNoteOptions: NoteOptions = {
  pitch: 'e/5',
  duration: 4,
  augmentationDots: 0,
  noteHead: 'black',
  stemDirection: 'up',
  size: 48,
};

export class Note {
  pitch: Pitch;
  duration: Duration;
  augmentationDots: AugmentationDot;
  noteHead: NoteHead;
  stemDirection: StemDirection;
  size: number;

  constructor(options: Partial<NoteOptions>) {
    const opts = { ...defaultNoteOptions, ...options };
    this.pitch = opts.pitch;
    this.duration = opts.duration;
    this.augmentationDots = opts.augmentationDots;
    this.noteHead = opts.noteHead;
    this.stemDirection = opts.stemDirection;
    this.size = opts.size;
  }

  toString(): string {
    return `${this.pitch}:1/${this.duration}`;
  }

  toGlyphIndices(): NoteGlyphIndices {
    const headIndex = NOTE_HEAD_GLYPHS[this.noteHead].index;
    let stemIndex = null;
    let flagIndex = null;

    if (this.hasStem()) {
      stemIndex = STEM_GLYPHS.normal.index;
    }

    if (this.hasFlag()) {
      const glyphName = `${this.stemDirection}${this.duration}` as Flag;
      flagIndex = FLAG_GLYPHS[glyphName].index;
    }

    const augmentationDotIndexes = Array<number>(this.augmentationDots).fill(
      AUGMENTATION_DOT_GLYPH.index
    );

    return {
      head: headIndex,
      stem: stemIndex,
      flag: flagIndex,
      augmentationDots: augmentationDotIndexes,
    };
  }

  hasStem(): boolean {
    return this.duration >= 4;
  }

  hasFlag(): boolean {
    return this.duration >= 8;
  }
}
