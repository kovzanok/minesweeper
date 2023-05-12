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
    window.addEventListener('newGame', Game.startNewGame);
  }

  static restartGame(e) {
    document.body.innerHTML = '';
    const [difficulty, mines] = e.detail;
    const headerInstance = new Header(mines, 0, 0);
    const header = headerInstance.renderHeader();
    const main = Main.renderMain(difficulty, mines);
    document.body.append(header, main);
  }

  static startNewGame(e) {
    document.body.innerHTML = '';
    const [difficulty, mines] = e.detail;
    const headerInstance = new Header(mines, 0, 0);
    const header = headerInstance.renderHeader();
    const main = Main.renderMain(difficulty, mines);
    document.body.append(header, main);
  }
}
