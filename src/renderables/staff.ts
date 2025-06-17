import { Staff } from '@/score';
import { CanvasRenderer } from '@/renderer';
import { Renderable } from '@/renderables';

export function staffToRenderable(staff: Staff, x: number, y: number): Renderable {
  return {
    async render(renderer: CanvasRenderer) {
      console.log('drawing staff', renderer, staff, 'x =', x, 'y =', y);
    },
  };
}
