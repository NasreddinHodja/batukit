import { noteHeadGlyphs, stemGlyphs, flagGlyphs } from '@/renderer';

type Step = 'c' | 'd' | 'e' | 'f' | 'g' | 'a' | 'b';
type Accidental = '' | '#' | 'b' | '##' | 'bb' | 'n';
type Octave = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type Pitch = `${Step}${Accidental}/${Octave}`;

export type Duration = 1 | 2 | 4 | 8 | 16 | 32 | 64;

export type NoteHead = keyof typeof noteHeadGlyphs;
export type Stem = keyof typeof stemGlyphs;
export type Flag = keyof typeof flagGlyphs;

export type StemDirection = 'up' | 'down';

export type NoteGlyphIndices = {
  head: number;
  stem: number | null;
  flag: number | null;
};

type NoteOptions = {
  noteHead: NoteHead;
  stemDirection: StemDirection;
  size: number;
};

const defaultNoteOptions: NoteOptions = {
  noteHead: 'black',
  stemDirection: 'up',
  size: 48,
};

export class Note {
  pitch: Pitch;
  duration: Duration;
  options: NoteOptions;

  constructor(pitch: Pitch, duration: Duration, options: Partial<NoteOptions>) {
    this.pitch = pitch;
    this.duration = duration;
    this.options = { ...defaultNoteOptions, ...options };
  }

  toString(): string {
    return `${this.pitch}:1/${this.duration}`;
  }

  toGlyphIndices(): NoteGlyphIndices {
    const headIndex = noteHeadGlyphs[this.options.noteHead].index;
    let stemIndex = null;
    let flagIndex = null;
    if (this.hasStem()) {
      stemIndex = stemGlyphs.normal.index;
    }
    if (this.hasFlag()) {
      const glyphName = `${this.options.stemDirection}${this.duration}` as Flag;
      flagIndex = flagGlyphs[glyphName].index;
    }
    return { head: headIndex, stem: stemIndex, flag: flagIndex };
  }

  hasStem(): boolean {
    return this.duration >= 4;
  }

  hasFlag(): boolean {
    return this.duration >= 8;
  }
}
