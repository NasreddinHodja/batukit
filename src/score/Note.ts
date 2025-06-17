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

export class Note {
  constructor(
    public pitch: Pitch,
    public duration: Duration,
    public noteHead: NoteHead = 'black',
    public stemDirection: StemDirection = 'up'
  ) {}

  toString(): string {
    return `${this.pitch}:1/${this.duration}`;
  }

  toGlyphIndices(): number[] {
    const indices = [];
    const headIndex = noteHeadGlyphs[this.noteHead].index;
    indices.push(headIndex);
    if (this.duration >= 4) {
      const stemIndex = stemGlyphs.normal.index;
      indices.push(stemIndex);
    }
    if (this.duration >= 8) {
      const glyphName = `${this.stemDirection}${this.duration}` as Flag;
      const flagIndex = flagGlyphs[glyphName].index;
      indices.push(flagIndex);
    }
    return indices;
  }
}
