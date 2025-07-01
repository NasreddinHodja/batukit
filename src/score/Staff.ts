import { Measure } from '@/score';

type StaffLines = 1 | 2 | 3 | 4 | 5;

const DEFAULT_STAFF_LENGTH: number = 200;
const DEFAULT_STAFF_LINES: StaffLines = 5;

type StaffOptions = {
  y: number;
  lines: StaffLines;
  length: number;
  noteStemDown: boolean;
};

const defaultStaffOptions: StaffOptions = {
  y: 100,
  lines: DEFAULT_STAFF_LINES,
  length: DEFAULT_STAFF_LENGTH,
  noteStemDown: false,
};

export class Staff {
  measures: Measure[];
  options: StaffOptions;

  constructor(measures: Measure[], options: Partial<StaffOptions>) {
    this.measures = measures;
    this.options = { ...defaultStaffOptions, ...options };
  }
}
