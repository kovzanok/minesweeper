export default class Field {
  constructor(difficulty = 'hard', mines = 0, savedGame = []) {
    this.difficulty = difficulty;
    this.mines = this.getMinesCount(mines);
    this.size = this.getSizeFromDifficulty();
    this.savedGame = savedGame;
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
    field.className = `field field_${this.difficulty}`;
    field.id = 'field';
    for (let i = 0; i < this.size * this.size; i += 1) {
      const cell = Field.renderCell(i);
      field.append(cell);
    }
    this.field = field;
    field.addEventListener('click', this.fieldClickHandler);
    return field;
  };

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
    } else if (
      cell.dataset.status === 'opened'
      || cell.dataset.status === 'flag'
    ) {
      // Do nothing
      return undefined;
    } else if (cell.textContent === 'B') {
      // Game over
      cell.setAttribute('data-status', 'bomb');
      cell.classList.remove('mines-hidden');
      this.isGameOver = true;
      this.openBombMines();
      // alert('Вы проиграли');
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
      bombCell.dataset.status = 'bomb';
      bombCell.classList.remove('mines-hidden');
    });
  }

  handleFirstClick(cell) {
    this.firstCell = cell.id;
    this.countAdjacentMines();
    this.insertNumbers();
    this.startTimer();
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
    const movesCounter = document.getElementById('moves');
    const currentMoves = Number(movesCounter.textContent);
    movesCounter.textContent = currentMoves + 1;
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

  checkWin() {
    const hiddenCellsCount = this.field.querySelectorAll(
      '.cell[data-status="hidden"]',
    ).length;
    const minesCount = this.minesArray.length;
    if (hiddenCellsCount === minesCount) {
      this.isGameOver = true;
      // alert('Вы победили');
      clearInterval(this.timerId);
    }
  }
}
