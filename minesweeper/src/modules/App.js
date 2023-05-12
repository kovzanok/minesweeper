import Game from './Game';

export default class App {
  constructor() {
    this.mines = App.getMinesCount() || 10;
    this.difficulty = App.getDifficulty() || 'medium';
    this.savedGame = App.getGameFromLocalStorage();
  }

  start() {
    const game = new Game(this.mines, this.difficulty, this.savedGame);
    game.start();
  }

  static getGameFromLocalStorage() {
    const savedGame = window.localStorage.getItem('saveGameObj');
    if (savedGame) {
      return JSON.parse(savedGame);
    }
    return {};
  }

  static getDifficulty() {
    const difficulty = window.localStorage.getItem('difficultyValue');
    return difficulty;
  }

  static getMinesCount() {
    const mines = window.localStorage.getItem('minesCountValue');
    return mines;
  }
}
