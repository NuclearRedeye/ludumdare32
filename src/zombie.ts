import { Rect } from './rect.js';
import { TileSet } from './tile-set.js';
import { width, height } from './constants.js';
import { Game } from './game.js';
import { Person } from './person.js';

export class Zombie extends Person {
  constructor(br: Rect, sprite: TileSet, game: Game) {
    super(br, width / 2, height / 2, 64, 64, sprite, game);
    this.x = Math.floor(Math.random() * (br.r - br.l - 40)) + 20;
    this.y = Math.floor(Math.random() * (br.b - br.t - 40)) + 20;
    this.ts = 4;
    this.setState(this.states.walk);
  }

  think() {
    //Should I turn
    if (Math.floor(Math.random() * 40) == 7) {
      this.rotate(Math.floor(Math.random() * 2) - 1);
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
