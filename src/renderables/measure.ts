import { Measure } from '@/score';
import { CanvasRenderer } from '@/renderer';
import { Renderable } from '@/renderables';

export function measureToRenderable(measure: Measure, x: number, y: number): Renderable {
  return {
    async render(renderer: CanvasRenderer) {
      console.log('drawing measure', renderer, measure, 'x =', x, 'y =', y);
    },
  };
}
