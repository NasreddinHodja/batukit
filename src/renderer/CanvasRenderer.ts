import { Note } from '@/score';
import { Color } from './Color';
import opentype, { Font, Glyph, Path } from 'opentype.js';

interface RenderOptions {
  foreground: Color;
  background: Color;
}

type NoteGlyphs = {
  head: Glyph;
  stem: Glyph | null;
  flag: Glyph | null;
};

export class CanvasRenderer {
  private font: Font | null = null;

  private constructor(
    public context: CanvasRenderingContext2D,
    public width: number = 600,
    public height: number = 300,
    public options?: RenderOptions
  ) {
    this.context.canvas.width = width;
    this.context.canvas.height = height;
    this.context.canvas.style.width = `${width}px`;
    this.context.canvas.style.height = `${height}px`;
    this.options = options ?? CanvasRenderer.getDefaultOptions();
  }

  static async init(
    ctx: CanvasRenderingContext2D,
    width: number = 600,
    height: number = 300,
    options?: RenderOptions
  ): Promise<CanvasRenderer> {
    const renderer = new CanvasRenderer(ctx, width, height, options);
    await renderer.ensureFontLoaded();
    return renderer;
  }

  async loadFont() {
    if (this.font) return;
    const bravuraURL = new URL('../fonts/Bravura.otf', import.meta.url).toString();
    const response = await fetch(bravuraURL);
    const arrayBuffer = await response.arrayBuffer();
    this.font = opentype.parse(arrayBuffer);
  }

  async drawPath(path: Path2D) {
    await this.ensureFontLoaded();

    this.setForegroundFillStyle();
    this.context.fill(path);
  }

  async ensureFontLoaded() {
    if (!this.font) await this.loadFont();
  }

  drawBackground() {
    const canvas = this.context.canvas;
    this.context.fillStyle = 'white';
    this.context.fillRect(0, 0, canvas.width, canvas.height);
  }

  async drawNote(note: Note, x: number, y: number, size: number = 48) {
    const paths = [];
    const glyphs = this.getNoteGlyphs(note);
    const headPath = this.getGlyphPath(glyphs.head, x, y, size);
    const stemUp = note.options.stemDirection === 'up';
    paths.push(headPath);

    if (glyphs.stem !== null) {
      const xOffset = stemUp ? size * 0.27 : size * 0.02;
      const yOffset = stemUp ? 0 : size * 0.875;
      const stemPath = this.getGlyphPath(glyphs.stem, x + xOffset, y + yOffset, size);
      paths.push(stemPath);
    }

    if (glyphs.flag !== null) {
      const xOffset = stemUp ? size * 0.27 : 0;
      const yOffset = stemUp ? size * -0.8 : size * 0.86;
      const flagPath = this.getGlyphPath(glyphs.flag, x + xOffset, y + yOffset, size);
      paths.push(flagPath);
    }

    const path = this.combinePaths(paths);
    const canvasPath = new Path2D(path.toPathData(2));
    await this.drawPath(canvasPath);

    const box = path.getBoundingBox();
    const boxWidth = Math.abs(box.x1 - box.x2);
    const boxHeight = Math.abs(box.y1 - box.y2);
    console.log(boxHeight * boxWidth);
  }

  getNoteGlyphs(note: Note): NoteGlyphs {
    const indices = note.toGlyphIndices();
    const headGlyph = this.getGlyph(indices.head);
    let stemGlyph = null;
    let flagGlyph = null;

    if (indices.stem !== null) {
      stemGlyph = this.getGlyph(indices.stem);
    }

    if (indices.flag !== null) {
      flagGlyph = this.getGlyph(indices.flag);
    }

    return { head: headGlyph, stem: stemGlyph, flag: flagGlyph };
  }

  getGlyph(index: number): Glyph {
    const glyph = this.font?.glyphs.get(index);
    if (!glyph) {
      throw Error(`Glyph ${index} not found`);
    }
    return glyph;
  }

  getGlyphPath(glyph: Glyph, x: number, y: number, size: number): Path {
    return glyph.getPath(x, y, size);
  }

  combinePaths(paths: Path[]): Path {
    const combined = new opentype.Path();
    combined.commands.push(...paths.flatMap((p) => p.commands));
    return combined;
  }

  setForegroundFillStyle() {
    this.context.fillStyle = (this.options?.foreground.hex ??
      CanvasRenderer.getDefaultOptions().foreground) as string;
  }

  static getDefaultOptions() {
    return {
      foreground: new Color('#ffffff'),
      background: new Color('#000000'),
    };
  }
}

// function flipPathHorizontal(path: Path): Path {
//   const bounds = path.getBoundingBox();
//   const cx = (bounds.x1 + bounds.x2) / 2;

//   const newPath = new Path();

//   for (const cmd of path.commands) {
//     switch (cmd.type) {
//       case 'M':
//       case 'L':
//         newPath.commands.push({
//           type: cmd.type,
//           x: -cmd.x + 2 * cx,
//           y: cmd.y,
//         });
//         break;
//       case 'C':
//         newPath.commands.push({
//           type: 'C',
//           x: -cmd.x + 2 * cx,
//           y: cmd.y,
//           x1: -cmd.x1 + 2 * cx,
//           y1: cmd.y1,
//           x2: -cmd.x2 + 2 * cx,
//           y2: cmd.y2,
//         });
//         break;
//       case 'Q':
//         newPath.commands.push({
//           type: 'Q',
//           x: -cmd.x + 2 * cx,
//           y: cmd.y,
//           x1: -cmd.x1 + 2 * cx,
//           y1: cmd.y1,
//         });
//         break;
//       case 'Z':
//         newPath.commands.push({ type: 'Z' });
//         break;
//     }
//   }

//   return newPath;
// }
