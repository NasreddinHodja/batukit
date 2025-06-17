import { Note } from './Note';

export class Measure {
  constructor(public notes: Note[] = []) {}

  toString() {
    const notes = this.notes.map((note) => `\t${note.toString()}`).join('\n');
    return `Measure { 
      notes: [\n${notes}\n]
    }`;
  }
}
