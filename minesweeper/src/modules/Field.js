import clickSound from '../assets/mp3/click.mp3';
import winSound from '../assets/mp3/win.mp3';
import loseSound from '../assets/mp3/lose.mp3';
import flagSound from '../assets/mp3/flag.mp3';
import MessageModal from './MessageModal';

import Controls from './Controls';
import { getDifficultyFromFieldClass, getTimeAndMoves } from './utils';
import Infos from './Infos';

export default class Field {
  constructor(difficulty = 'easy', mines = 0, savedGame = {}) {
    this.difficulty = difficulty;
    this.mines = this.getMinesCount(mines);
    this.size = this.getSizeFromDifficulty();
    this.savedField = savedGame.cells || [];
    this.isGameOver = false;
    this.isPause = false;
    window.addEventListener('timerPause', this.pauseTimer);
    window.addEventListener('timerGo', this.goTimer);
  }

  pauseTimer = () => {
    this.isPause = true;
  };

  goTimer = () => {
    this.isPause = false;
  };

  getSizeFromDifficulty() {
    switch (this.difficulty) {
      case 'easy':
        return 10;
      case 'medium':
        return 15;
      case 'hard':
        return 25;
      default:
        return 15;
    }
  }

  renderField = () => {
    const field = document.createElement('div');
    this.field = field;
    field.className = `field field_${this.difficulty}`;
    field.id = 'field';
    if (this.savedField.length === 0) {
      for (let i = 0; i < this.size * this.size; i += 1) {
        const cell = Field.renderCell(i);
        field.append(cell);
      }
    } else {
      this.renderFieldFromSave(field);
      this.checkGameAvailable();
    }

    field.addEventListener('click', this.fieldClickHandler);
    return field;
  };

  renderFieldFromSave(field) {
    this.savedField.forEach((cellInfo) => {
      const cell = Field.renderCellFromSave(cellInfo);

      this.getMinesArrayFromSave(cell);
      field.append(cell);
    });
  }

  putResultToList() {
    const [time, moves] = getTimeAndMoves();
    const mines = this.minesArray.length;
    const difficulty = getDifficultyFromFieldClass(this.field.className);
    const saveToResultsEvent = new CustomEvent('saveToResults', {
      detail: {
        difficulty,
        time,
        moves,
        mines,
      },
    });

    window.dispatchEvent(saveToResultsEvent);
  }

  getMinesArrayFromSave(cell) {
    if (!this.minesArray) {
      this.minesArray = [];
    }
    if (cell.textContent === 'B') {
      this.minesArray.push(Number(cell.id));
    }
  }

  static renderCellFromSave({
    id, status, textContent, coord, className,
  }) {
    const cell = document.createElement('div');
    cell.id = id;
    cell.className = className;
    cell.setAttribute('data-status', status);
    cell.setAttribute('data-coord', coord);
    cell.textContent = textContent;
    return cell;
  }

  static renderCell(index) {
    const cell = document.createElement('div');
    cell.id = index;
    cell.className = 'cell';
    cell.setAttribute('data-status', 'hidden');
    return cell;
  }

  fieldClickHandler = (e) => {
    if (e.target.classList.contains('cell')) {
      const cell = e.target;
      this.handleCellClick(cell);
    }
    return undefined;
  };

  handleCellClick(cell) {
    if (this.isGameOver) {
      return undefined;
    }
    if (!this.firstCell) {
      this.handleFirstClick(cell);
    }
    if (Infos.isFlagMode && cell.dataset.status !== 'opened') {
      if (cell.dataset.status === 'flag') {
        cell.dataset.status = 'hidden';
        Field.changeMinesLeftCount('+');
        Field.changeFlagsCount('-');
      } else {
        cell.dataset.status = 'flag';
        Field.changeMinesLeftCount('-');
        Field.changeFlagsCount('+');
      }
      Field.addClick();
      return undefined;
    }
    if (cell.dataset.status === 'opened' || cell.dataset.status === 'flag') {
      // Do nothing
      return undefined;
    }
    if (cell.textContent === 'B') {
      // Game over
      Field.addClick();
      cell.setAttribute('data-status', 'bomb');
      cell.classList.remove('mines-hidden');
      this.isGameOver = true;
      this.openBombMines();
      return undefined;
    }
    Field.addClick();
    this.openCell(cell);
    this.checkWin();
    return undefined;
  }

  openCell = (cell) => {
    cell.dataset.status = 'opened';
    cell.classList.remove('mines-hidden');

    if (cell.textContent !== '0') {
      return;
    }

    for (let j = -1; j <= 1; j += 1) {
      for (let i = -1; i <= 1; i += 1) {
        const [row, col] = cell.dataset.coord.split('-').map((item) => +item);
        if (
          !(
            col + i < 0
            || row + j < 0
            || col + i >= this.size
            || row + j >= this.size
          )
        ) {
          const adjacentId = col + i + this.size * (row + j);
          const adjacentCell = document.getElementById(adjacentId);
          if (adjacentCell.dataset.status === 'hidden') {
            this.openCell(adjacentCell);
          }
        }
      }
    }
  };

  openBombMines() {
    clearInterval(this.timerId);
    this.minesArray.forEach((mineId) => {
      const bombCell = document.getElementById(mineId);
      if (bombCell) {
        bombCell.dataset.status = 'bomb';
        bombCell.classList.remove('mines-hidden');
      }
    });
    if (!Controls.isMuted) {
      const lose = new Audio(loseSound);
      lose.play();
    }
    const modal = MessageModal.render({
      win: false,
    });
    document.body.append(modal);
  }

  handleFirstClick(cell) {
    this.firstCell = cell.id;
    this.startTimer();
    if (this.savedField.length === 0) {
      this.countAdjacentMines();
      this.insertNumbers();
    }
  }

  generateMinesArray() {
    const minesArray = [];
    while (minesArray.length < this.mines) {
      const randomPosition = Math.floor(Math.random() * this.size ** 2);
      if (
        !minesArray.includes(randomPosition)
        && randomPosition !== Number(this.firstCell)
      ) {
        minesArray.push(randomPosition);
      }
    }
    this.minesArray = minesArray;
  }

  getMinesCount(mines) {
    if (mines === 0) {
      if (this.size === 10) {
        return 5;
      }
      if (this.size === 16) {
        return 30;
      }
      return 30;
    }
    return mines;
  }

  insertNumbers = () => {
    const cells = this.field.querySelectorAll('.cell');
    for (let j = 0; j < this.size; j += 1) {
      for (let i = 0; i < this.size; i += 1) {
        const id = i + this.size * j;
        const mines = this.fieldMatrix[j][i];
        cells[id].textContent = mines;
        cells[id].setAttribute('data-coord', `${j}-${i}`);
        if (this.fieldMatrix[j][i] > 0) {
          cells[id].classList.add(`mines-${mines}`);
        }

        cells[id].classList.add('mines-hidden');
      }
    }
  };

  generateFieldMatrix() {
    const fieldMatrix = [];
    this.generateMinesArray();
    for (let j = 0; j < this.size; j += 1) {
      const fieldRow = new Array(this.size).fill(0);
      fieldMatrix.push(fieldRow);
    }
    return fieldMatrix;
  }

  countAdjacentMines() {
    this.fieldMatrix = this.generateFieldMatrix();
    for (let j = 0; j < this.size; j += 1) {
      for (let i = 0; i < this.size; i += 1) {
        const id = i + this.size * j;
        if (this.minesArray.includes(id)) {
          this.fieldMatrix[j][i] = 'B';
        } else {
          const count = this.countMinesNearCell(i, j);
          this.fieldMatrix[j][i] = count;
        }
      }
    }
  }

  countMinesNearCell(col, row) {
    let count = 0;
    for (let i = -1; i <= 1; i += 1) {
      for (let j = -1; j <= 1; j += 1) {
        if (
          !(
            col + i < 0
            || row + j < 0
            || col + i >= this.size
            || row + j >= this.size
          )
        ) {
          const id = col + i + this.size * (row + j);
          if (this.minesArray.includes(id)) {
            count += 1;
          }
        }
      }
    }
    return count;
  }

  static addClick() {
    if (!Infos.isFlagMode) {
      const movesCounter = document.getElementById('moves');
      const currentMoves = Number(movesCounter.textContent);
      movesCounter.textContent = currentMoves + 1;
    }

    if (!Controls.isMuted) {
      if (Infos.isFlagMode) {
        const click = new Audio(flagSound);
        click.play();
      } else {
        const click = new Audio(clickSound);
        click.play();
      }
    }
  }

  startTimer() {
    const time = document.getElementById('time');
    const tick = () => {
      if (!this.isPause) {
        const timeValue = Number(time.textContent);
        time.textContent = timeValue + 1;
      }
    };
    this.timerId = setInterval(tick, 1000);
  }

  checkGameAvailable() {
    const hiddenCellsCount = this.field.querySelectorAll(
      '.cell[data-status="hidden"]',
    ).length;
    const flaggedCellsCount = this.field.querySelectorAll(
      '.cell[data-status="flag"]',
    ).length;
    const minesCount = this.minesArray.length;
    const openedBombs = this.field.querySelectorAll(
      '.cell[data-status="bomb"]',
    ).length;

    if (openedBombs === minesCount || hiddenCellsCount + flaggedCellsCount === minesCount) {
      this.isGameOver = true;
    }
  }

  static changeMinesLeftCount(operation) {
    const minesLeft = document.getElementById('mines-left');
    if (operation === '+') {
      minesLeft.textContent = Number(minesLeft.textContent) + 1;
    } else {
      minesLeft.textContent = Number(minesLeft.textContent) - 1;
    }
  }

  static changeFlagsCount(operation) {
    const flags = document.getElementById('flags');
    if (operation === '+') {
      flags.textContent = Number(flags.textContent) + 1;
    } else {
      flags.textContent = Number(flags.textContent) - 1;
    }
  }

  checkWin() {
    const hiddenCellsCount = this.field.querySelectorAll(
      '.cell[data-status="hidden"]',
    ).length;
    const flaggedCellsCount = this.field.querySelectorAll(
      '.cell[data-status="flag"]',
    ).length;
    const minesCount = this.minesArray.length;

    if (hiddenCellsCount + flaggedCellsCount === minesCount) {
      this.isGameOver = true;
      clearInterval(this.timerId);
      if (!Controls.isMuted) {
        const win = new Audio(winSound);
        win.play();
      }
      const [time, moves] = getTimeAndMoves();
      const modal = MessageModal.render({
        win: true,
        time,
        moves,
      });
      document.body.append(modal);
      this.putResultToList();
    }
  }
}
