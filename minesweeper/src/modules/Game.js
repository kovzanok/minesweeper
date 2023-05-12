import Header from './Header';
import Main from './Main';

export default class Game {
  constructor(mines, difficulty, savedGame) {
    this.mines = mines;
    this.difficulty = difficulty;
    this.savedGame = savedGame;
    this.time = savedGame.time;
    this.moves = savedGame.moves;
  }

  start() {
    const headerInstance = new Header(this.time, this.moves);
    const header = headerInstance.renderHeader();
    const main = Main.renderMain(this.difficulty, this.mines, this.savedGame);
    document.body.append(header, main);
    window.addEventListener('restart', Game.restartGame);
  }

  static restartGame() {}
}
