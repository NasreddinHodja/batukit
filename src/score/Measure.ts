import { Note } from '@/index';

export type MeasureOptions = {
  notes: Note[];
};

const defaultNoteOptions: MeasureOptions = {
  notes: [],
};

export class Measure {
  notes: Note[];

  constructor(options: Partial<MeasureOptions>) {
    const opts = { ...defaultNoteOptions, ...options };
    this.notes = opts.notes;
  }

  clone(): Measure {
    return new Measure({ notes: [...this.notes] });
  }

  toString(): string {
    const notes = this.notes.map((note) => `\t${note.toString()}`).join('\n');
    return `Measure { 
      notes: [\n${notes}\n]
    }`;
  }
}
