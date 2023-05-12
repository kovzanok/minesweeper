import {
  capitalize,
  getDifficultyFromFieldClass,
  getTimeAndMoves,
} from './utils';
import NewGameModal from './NewGameModal';
import ResultsModal from './ResultsModal';

export default class Controls {
  static isMuted = false;

  static renderControls() {
    const controls = document.createElement('ul');
    controls.className = 'controls';
    const buttonArr = [
      'restart',
      'save',
      'latest-10',
      'toggle',
      'new game',
      'sound',
    ];

    buttonArr.forEach((buttonAction) => {
      const control = Controls.renderControl(buttonAction);
      if (buttonAction === 'toggle') {
        control.addEventListener('click', Controls.toggleTheme);
      } else if (buttonAction === 'new game') {
        control.addEventListener('click', Controls.displayNewGameModal);
      } else if (buttonAction === 'restart') {
        control.addEventListener('click', Controls.restartGame);
      } else if (buttonAction === 'sound') {
        control.addEventListener('click', Controls.toggleSound);
      } else if (buttonAction === 'save') {
        control.addEventListener('click', Controls.saveGame);
      } else if (buttonAction === 'latest-10') {
        control.addEventListener('click', Controls.showResults);
      }
      controls.append(control);
    });

    return controls;
  }

  static renderControl(action) {
    const control = document.createElement('li');
    control.className = 'control';

    const button = document.createElement('button');
    button.className = 'button button_control';
    button.setAttribute('data-action', action);

    if (action === 'sound') {
      button.textContent = `${capitalize(action)}: ${
        Controls.isMuted ? 'Off' : 'On'
      }`;
    } else {
      button.textContent = capitalize(action);
    }
    control.append(button);
    return control;
  }

  static toggleTheme() {
    const isLightTheme = document.body.classList.toggle('light-theme');
    window.localStorage.setItem('isLightTheme', isLightTheme);
  }

  static displayNewGameModal() {
    const gameModal = NewGameModal.render();

    document.body.append(gameModal);
  }

  static restartGame() {
    const field = document.getElementById('field');
    const difficulty = getDifficultyFromFieldClass(field.classList.toString());
    const cells = Array.from(field.querySelectorAll('.cell'));
    const mines = cells.reduce(
      (sum, cell) => (cell.textContent === 'B' ? sum + 1 : sum + 0),
      0,
    ) || Number(document.getElementById('mines-left').textContent);
    const restartGameEvent = new CustomEvent('restart', {
      detail: [difficulty, mines],
    });
    window.dispatchEvent(restartGameEvent);
  }

  static toggleSound() {
    Controls.isMuted = !Controls.isMuted;
    const soundButton = document.body.querySelector('[data-action="sound"]');
    soundButton.textContent = `Sound: ${Controls.isMuted ? 'Off' : 'On'}`;
  }

  static saveGame(e) {
    const button = e.target;
    Controls.saveDifficulty();
    Controls.saveMines();
    Controls.saveField();
    button.textContent = 'Saving';
    button.disabled = true;
    setTimeout(() => {
      button.textContent = 'Save';
      button.disabled = false;
    }, 500);
  }

  static saveDifficulty() {
    const field = document.getElementById('field');
    const difficulty = getDifficultyFromFieldClass(field.classList.toString());
    window.localStorage.setItem('difficultyValue', difficulty);
  }

  static saveMines() {
    const field = document.getElementById('field');
    const cells = Array.from(field.querySelectorAll('.cell'));
    const mines = cells.reduce(
      (sum, cell) => (cell.textContent === 'B' ? sum + 1 : sum + 0),
      0,
    ) || Number(document.getElementById('mines-left').textContent);
    window.localStorage.setItem('minesCountValue', mines);
  }

  static saveField() {
    const [time, moves] = getTimeAndMoves();
    const savedFieldObj = {
      cells: [],
      minesLeft: 0,
      time,
      moves,
    };
    const field = document.getElementById('field');
    const cells = Array.from(field.querySelectorAll('.cell'));

    if (!cells.every((cell) => cell.textContent === '')) {
      cells.forEach((cell) => {
        if (cell.dataset.status === 'flag') {
          savedFieldObj.minesLeft -= 1;
        }
        savedFieldObj.cells.push({
          id: cell.id,
          status: cell.dataset.status,
          coord: cell.dataset.coord,
          className: cell.className,
          textContent: cell.textContent,
        });
      });
    }
    window.localStorage.setItem('saveGameObj', JSON.stringify(savedFieldObj));
  }

  static showResults() {
    const resultModal = ResultsModal.render();

    document.body.append(resultModal);
  }
}
