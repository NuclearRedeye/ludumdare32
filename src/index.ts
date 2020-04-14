import { width, height } from './constants.js';
import { map_sprites, map_tiles } from './data.js';
import { Game } from './game.js';
import { TileSet } from './tile-set.js';

let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;
let game: Game;

const tick = function(): void {
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
  const img_sprites = document.getElementById('sprites') as HTMLImageElement;
  const img_tiles = document.getElementById('tiles') as HTMLImageElement;
  const ts_tiles = new TileSet(img_tiles, map_tiles, 16, 16);
  const ts_sprites = new TileSet(img_sprites, map_sprites, 16, 16);

  canvas = document.getElementById('canvas') as HTMLCanvasElement;
  context = canvas.getContext('2d') as CanvasRenderingContext2D;
  context.imageSmoothingEnabled = false;

  game = new Game(ts_tiles, ts_sprites, canvas);
  tick();
};
