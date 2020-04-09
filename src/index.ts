import { width, height } from './constants.js';
import { map_sprites, map_tiles } from './data.js';
import { Game } from './game.js';
import { TileSet } from './tile-set.js';

let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;
let game: Game;

var tick = function(): void {
  context.fillStyle = 'black';
  context.fillRect(0, 0, width, height);
  game.update();
  game.draw(context);
  if (game.running == true) {
    window.requestAnimationFrame(tick);
  }
};

window.onkeydown = function(e: KeyboardEvent): void {
  game.onKeyDown(e.keyCode);
  e.preventDefault();
};

window.onkeyup = function(e: KeyboardEvent): void {
  game.onKeyUp(e.keyCode);
  e.preventDefault();
};

window.onload = function(): void {
  const img_sprites = <HTMLImageElement>document.getElementById('sprites');
  const img_tiles = <HTMLImageElement>document.getElementById('tiles');
  const ts_tiles = new TileSet(img_tiles, map_tiles, 16, 16);
  const ts_sprites = new TileSet(img_sprites, map_sprites, 16, 16);

  canvas = <HTMLCanvasElement>document.getElementById('canvas');
  context = <CanvasRenderingContext2D>canvas.getContext('2d');
  context.imageSmoothingEnabled = false;

  game = new Game(ts_tiles, ts_sprites, canvas);
  tick();
};
