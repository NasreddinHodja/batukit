export type Step = 'c' | 'd' | 'e' | 'f' | 'g' | 'a' | 'b';
export type Accidental = '' | '#' | 'b' | '##' | 'bb' | 'n';
export type Octave = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type Pitch = `${Step}${Accidental}/${Octave}`;
