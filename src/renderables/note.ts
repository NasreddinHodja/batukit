import { Note } from '@/score';
import { CanvasRenderer } from '@/renderer';
import { Renderable } from '@/renderables';

export function noteToRenderable(note: Note, x: number, y: number): Renderable {
  return {
    render(renderer: CanvasRenderer) {
      console.log('drawing note', renderer, note, 'x =', x, 'y =', y);
      renderer.drawNote(note, x, y);
    },
  };
}
