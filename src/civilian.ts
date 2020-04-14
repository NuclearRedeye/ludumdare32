import { Person } from './person.js';
import { TileSet } from './tile-set.js';
import { Game } from './game.js';
import { Rect } from './rect.js';

export class Civilian extends Person {
  constructor(br: Rect, sprite: TileSet, game: Game) {
    let sx = Math.floor(Math.random() * br.r) + br.l;
    let sy = Math.floor(Math.random() * br.b) + br.t;

    if (Math.floor(Math.random() * 2 + 1) == 1) sy = Math.floor(Math.random() * 2 + 1) == 1 ? br.t : br.b;
    else sx = Math.floor(Math.random() * 2 + 1) == 1 ? br.l : br.r;

    super(br, sx, sy, 64, 64, sprite, game);
    //this.x = Math.floor(Math.random() * ((br.r - br.l) - 40)) + 20;
    //this.y = Math.floor(Math.random() * ((br.b - br.t) - 40)) + 20;
    this.ts = Math.floor(Math.random() * 3) + 1;
    this.setState(this.states.walk);
  }

  think(): void {
    //Should I turn
    if (Math.floor(Math.random() * 40) == 7) {
      this.rv = Math.floor(Math.random() * 2) - 1;
    } else {
      this.rv = 0;
    }

    /*
					//Shall I move
					else if (Math.floor(Math.random() * 9) == 3)
					{
						this.setState(this.states.walk);
					}
					*/
  }
}
