import { Note, Score, Staff, Color, Measure } from '@/index';
import { PositionedItem } from '@/renderer/layout/types';
import opentype, { Font, Glyph, Path } from 'opentype.js';
import { buildNoteGlyphLayoutPaths, getNoteWidth } from './layout/note';
import { NoteGlyphs } from './types';
import { layoutMeasure } from './layout/measure';
import { LayoutContext } from './layout/types';

interface RenderOptions {
  foreground: Color;
  background: Color;
}

export class CanvasRenderer {
  private font: Font | null = null;
  layoutContext: LayoutContext;

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
    this.layoutContext = {
      getGlyphPath: this.getGlyphPath.bind(this),
      getNoteGlyphs: this.getNoteGlyphs.bind(this),
      getNoteWidth: (note) => getNoteWidth(note, this.layoutContext),
    };
  }

  static async init(
    ctx: CanvasRenderingContext2D,
    width: number = 600,
    height: number = 300,
    options?: RenderOptions
  ): Promise<CanvasRenderer> {
    const renderer = new CanvasRenderer(ctx, width, height, options);

    await renderer.ensureFontLoaded();

    renderer.setForeground();

    return renderer;
  }

  async loadFont() {
    if (this.font) return;
    const bravuraURL = new URL('../fonts/Bravura.otf', import.meta.url).toString();
    const response = await fetch(bravuraURL);
    const arrayBuffer = await response.arrayBuffer();
    this.font = opentype.parse(arrayBuffer);
  }

  async ensureFontLoaded() {
    if (!this.font) await this.loadFont();
  }

  drawPath(path: Path2D) {
    this.context.fill(path);
  }

  drawBackground() {
    const canvas = this.context.canvas;
    this.context.fillStyle = 'white';
    this.context.fillRect(0, 0, canvas.width, canvas.height);
  }

  draw(item: PositionedItem) {
    if (item.item instanceof Score) {
      // this.drawScore(item.item, item.x, item.y);
    } else if (item.item instanceof Staff) {
      this.drawStaff(item.item, item.x, item.y);
    } else if (item.item instanceof Measure) {
      this.drawMeasure(item.item, item.x, item.y);
    } else if (item.item instanceof Note) {
      this.drawNote(item.item, item.x, item.y);
    } else {
      throw Error(`Error: item is not drawable: ${JSON.stringify(item)}`);
    }
  }

  // drawScore(score: Score, x: number, y: number) {
  //   this.setForeground();

  //   const layed = layout(score, x, y);
  //   this.draw(layed);

  // let curr_x = x;
  // const spacing = 50;
  // const positionedItems = [];

  // for (const staff of score.staves) {
  //   positionedItems.push(staff.layout(curr_x, y));
  //   for (const measure of staff.measures) {
  //     positionedItems.push(measure.layout(curr_x, y));
  //     for (const note of measure.notes) {
  //       positionedItems.push(note.layout(curr_x, y));
  //       curr_x += getNoteSpacing(note);
  //     }
  //     curr_x += spacing * 0.5;
  //   }
  // }

  // positionedItems.forEach((item) => {
  //   this.draw();
  // });

  // const renderables = layoutScore(score, curr_x, y);

  // renderables.map((r) => {
  //   r.draw(this);
  // });
  // }

  drawMeasure(measure: Measure, x: number, y: number) {
    const positionedItems = layoutMeasure(measure, x, y, this.layoutContext);

    for (const positioned of positionedItems) {
      if (positioned.item === measure) continue;

      this.draw(positioned);
    }
  }

  // drawMeasure(measure: Measure, x: number, y: number) {
  //   const positionedItems = layoutMeasure(measure, x, y);

  //   // 2. Iterate over positioned items and render each accordingly
  //   for (const positioned of positionedItems) {
  //     const item = positioned.item;

  //     if (item instanceof Note) {
  //       this.drawNote(item, positioned.x, positioned.y);
  //     } else if (item instanceof Measure) {
  //       // optionally draw measure-level decorations (bar lines, etc)
  //       // this.drawMeasureOutline(item, positioned.x, positioned.y);
  //     } else {
  //       // optionally handle other types or throw
  //       throw new Error(`Unsupported item type in measure layout: ${item.constructor.name}`);
  //     }
  //   }
  // }

  drawStaff(staff: Staff, x: number, y: number) {
    this.context.lineWidth = 2;
    this.context.beginPath();
    this.context.moveTo(x, y);
    this.context.lineTo(staff.length, y);
    this.context.stroke();

    let currentX = x;
    for (const measure of staff.measures) {
      const items = layoutMeasure(measure, currentX, y, this.layoutContext);

      for (const item of items) {
        if (!(item.item instanceof Measure)) {
          this.draw(item);
        }
      }

      const totalSpacing = 10; // TODO: get measure width

      currentX += totalSpacing;
    }
  }

  // drawNote(note: Note, x: number, y: number) {
  //   const size = note.size;
  //   const paths = [];
  //   const glyphs = this.getNoteGlyphs(note);
  //   const stemUp = note.stemDirection === 'up';

  //   let accidentalSpace = 0;

  //   // LEFT
  //   if (glyphs.accidental !== null) {
  //     const accidentalPath = this.getGlyphPath(glyphs.accidental, x, y, size * 0.8);
  //     const bbox = accidentalPath.getBoundingBox();
  //     const width = Math.abs(bbox.x1 - bbox.x2);
  //     accidentalSpace += width + size * 0.05;
  //     paths.push(accidentalPath);
  //   }

  //   // MIDDLE
  //   if (glyphs.stem !== null) {
  //     const xOffset = stemUp ? size * 0.27 : size * 0.02;
  //     const yOffset = stemUp ? 0 : size * 0.875;
  //     const stemPath = this.getGlyphPath(
  //       glyphs.stem,
  //       x + accidentalSpace + xOffset,
  //       y + yOffset,
  //       size
  //     );
  //     paths.push(stemPath);
  //   }

  //   if (glyphs.flag !== null) {
  //     const xOffset = stemUp ? size * 0.27 : 0;
  //     const yOffset = stemUp ? size * -0.8 : size * 0.86;
  //     const flagPath = this.getGlyphPath(
  //       glyphs.flag,
  //       x + accidentalSpace + xOffset,
  //       y + yOffset,
  //       size
  //     );
  //     paths.push(flagPath);
  //   }

  //   const headPath = this.getGlyphPath(glyphs.head, x + accidentalSpace, y, size);
  //   paths.push(headPath);

  //   // RIGHT
  //   if (glyphs.augmentationDots.length > 0) {
  //     const baseXOffset = accidentalSpace * 0.1 + size * 0.35;
  //     const yOffset = size * -0.1;
  //     let xOffset = baseXOffset;
  //     glyphs.augmentationDots.forEach((glyph) => {
  //       const dotPath = this.getGlyphPath(glyph, x + baseXOffset + xOffset, y + yOffset, size);
  //       paths.push(dotPath);
  //       xOffset += baseXOffset * 0.5;
  //     });
  //   }

  //   const path = this.combinePaths(paths);
  //   const canvasPath = new Path2D(path.toPathData(2));
  //   this.drawPath(canvasPath);
  // }

  drawNote(note: Note, x: number, y: number) {
    const paths = buildNoteGlyphLayoutPaths(note, x, y, this.layoutContext);

    const combinedPaths = this.combinePaths(paths);
    const canvasPath = new Path2D(combinedPaths.toPathData(2));
    this.drawPath(canvasPath);
  }

  getNoteGlyphs(note: Note): NoteGlyphs {
    const indices = note.toGlyphIndices();

    const headGlyph = this.getGlyph(indices.head);
    const stemGlyph = indices.stem !== null ? this.getGlyph(indices.stem) : null;
    const flagGlyph = indices.flag !== null ? this.getGlyph(indices.flag) : null;

    const augmentationDotGlyphs =
      indices.augmentationDots.length > 0
        ? Array<Glyph>(indices.augmentationDots.length).fill(
            this.getGlyph(indices.augmentationDots[0])
          )
        : [];

    const accidentalGlyph = indices.accidental !== null ? this.getGlyph(indices.accidental) : null;

    return {
      head: headGlyph,
      stem: stemGlyph,
      flag: flagGlyph,
      augmentationDots: augmentationDotGlyphs,
      accidental: accidentalGlyph,
    };
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

  setForeground() {
    this.context.fillStyle = (this.options?.foreground.hex ??
      CanvasRenderer.getDefaultOptions().foreground) as string;
    this.context.strokeStyle = this.context.fillStyle;
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
