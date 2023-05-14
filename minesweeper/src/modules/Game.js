import Header from './Header';
import Main from './Main';

export default class Game {
  constructor(mines, difficulty, savedGame) {
    this.mines = mines;
    this.difficulty = difficulty;
    this.savedGame = savedGame;
    this.time = savedGame.time;
    this.moves = savedGame.moves;
    this.flags = Game.countFlags(savedGame.cells);
  }

  static countFlags(cells) {
    if (!cells || cells.length === 0) {
      return 0;
    }
    const flagsCount = cells.reduce((flags, cell) => {
      if (cell.status === 'flag') return flags + 1;
      return flags;
    }, 0);
    return flagsCount;
  }

  start() {
    const headerInstance = new Header(
      Number(this.mines) - this.savedGame.minesLeft || 10,
      this.time,
      this.moves,
      this.flags,
    );
    const header = headerInstance.renderHeader();
    document.body.append(header);
    const main = Main.renderMain(this.difficulty, this.mines, this.savedGame);
    document.body.append(main);
    window.addEventListener('restart', Game.restartGame);
    window.addEventListener('newGame', Game.startNewGame);
    window.addEventListener('saveToResults', Game.saveToResults);
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

  static saveToResults(e) {
    const savedResults = JSON.parse(
      localStorage.getItem('savedResults') || '[]',
    );
    const {
      time, mines, difficulty, moves,
    } = e.detail;

    if (savedResults.length >= 10) {
      savedResults.shift();
    }
    savedResults.push({
      time,
      mines,
      difficulty,
      moves,
    });
    localStorage.setItem('savedResults', JSON.stringify(savedResults));
  }
}
