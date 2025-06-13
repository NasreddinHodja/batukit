import { Pitch } from '@/score';

export class Note {
  constructor(
    public pitch: Pitch,
    public duration: string
  ) {}
}
