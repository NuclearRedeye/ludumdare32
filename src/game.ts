import { World } from './world.js';
import { width, world_tile_w, world_tile_h } from './constants.js';
import { layer01 } from './map.js';
import { Rect } from './rect.js';
import { TileSet } from './tile-set.js';

export class Game {
  private w: World;
  public running: boolean;
  public score: number;

  constructor(tiles: TileSet, sprites: TileSet, canvas: HTMLCanvasElement) {
    console.log('Game()');

    this.w = new World(layer01[0].length * world_tile_w, layer01.length * world_tile_h, tiles, sprites, this, canvas);
    this.running = true;
    this.score = 0;
  }

  onKeyDown(kc: number) {
    this.w.onKeyDown(kc);

    //Main key presses
    switch (kc) {
      case 80: //p = pause
        this.running = !this.running;
        //tick();
        break;
    }
  }

  onKeyUp(kc: number) {
    this.w.onKeyUp(kc);
  }

  getWorld() {
    return this.w;
  }

  update() {
    this.w.update();
  }

  draw(context: CanvasRenderingContext2D) {
    // FIXME: This needs looking at
    const cr: Rect = {
      l: 0,
      t: 0,
      r: 0,
      b: 0,
    };
    this.w.draw(cr, context);

    context.save();
    context.font = '24px serif';
    context.fillStyle = 'white';
    context.strokeStyle = 'black';
    context.textBaseline = 'hanging';
    var td = context.measureText(this.score.toString());
    context.fillText(this.score.toString(), width - 10 - td.width, 10);
    context.restore();
  }
}
