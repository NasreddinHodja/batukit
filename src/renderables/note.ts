import { Note } from '@/score';
import { CanvasRenderer } from '@/renderer';
import { Renderable } from '@/renderables';

export function noteToRenderable(note: Note, x: number, y: number): Renderable {
  return {
    render(renderer: CanvasRenderer) {
      renderer.drawCircle(x, y, 7);
      renderer.drawText(note.pitch, x - 5, y - 10);
    },
  };
}
