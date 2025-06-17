import { Measure } from '@/score';

type StaffLines = 1 | 2 | 3 | 4 | 5;

const DEFAULT_STAFF_LENGTH: number = 200;
const DEFAULT_STAFF_LINES: StaffLines = 5;

export class Staff {
  constructor(
    public lines: StaffLines = DEFAULT_STAFF_LINES,
    public length: number = DEFAULT_STAFF_LENGTH,
    public y: number,
    public measures: Measure[]
  ) {}
}
