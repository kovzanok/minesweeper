import Game from './Game';

export default class App {
  constructor() {
    this.mines = App.getMinesCount() || 10;
    this.difficulty = App.getDifficulty() || 'easy';
    this.savedGame = App.getGameFromLocalStorage();
  }

  start() {
    App.applyTheme();
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

  static applyTheme() {
    const isLightTheme = window.localStorage.getItem('isLightTheme') === 'true';
    if (isLightTheme) {
      document.body.classList.add('light-theme');
    }
  }
}
