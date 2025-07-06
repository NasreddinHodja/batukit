import { Staff } from '@/score/Staff';

type ScoreOptions = {
  staves: Staff[];
};

const defaultScoreOptions: ScoreOptions = {
  staves: [],
};

export class Score {
  staves: Staff[];

  constructor(options: Partial<ScoreOptions>) {
    const opts = { ...defaultScoreOptions, ...options };
    this.staves = opts.staves;
  }
}
