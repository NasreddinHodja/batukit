import { Measure } from '@/index';

type StaffLines = 1 | 2 | 3 | 4 | 5;

const DEFAULT_STAFF_LENGTH = 400;
const DEFAULT_STAFF_LINES: StaffLines = 5;

export type StaffOptions = {
  measures: Measure[];
  y: number;
  lines: StaffLines;
  length: number;
  noteStemDown: boolean;
  size: number;
};

const defaultStaffOptions: StaffOptions = {
  measures: [],
  y: 100,
  lines: DEFAULT_STAFF_LINES,
  length: DEFAULT_STAFF_LENGTH,
  noteStemDown: false,
  size: 48,
};

export class Staff {
  measures: Measure[];
  y: number;
  lines: StaffLines;
  length: number;
  noteStemDown: boolean;
  size: number;

  constructor(options: Partial<StaffOptions>) {
    const opts = { ...defaultStaffOptions, ...options };
    this.measures = opts.measures;
    this.y = opts.y;
    this.lines = opts.lines;
    this.length = opts.length;
    this.noteStemDown = opts.noteStemDown;
    this.size = opts.size;
  }
}
