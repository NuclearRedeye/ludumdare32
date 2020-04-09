import { SpriteMap } from './sprite-map.js';

export class TileSet {
  public s: HTMLImageElement; // Sprite sheet.
  public m: SpriteMap; // Map of individual tiles within the source image.
  public tw: number; // Width, in pixels, of a tile.
  public th: number; // Height, in pixels, of a tile.

  constructor(s: HTMLImageElement, m: SpriteMap, tw: number = 16, th: number = 16) {
    console.log('TileSet()');
    this.s = s;
    this.m = m;
    this.tw = tw;
    this.th = th;
  }
}
