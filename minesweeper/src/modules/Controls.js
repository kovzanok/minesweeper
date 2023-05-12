import { capitalize, getDifficultyFromFieldClass } from './utils';
import NewGameModal from './NewGameModal';

export default class Controls {
  static isMuted = false;

  static renderControls() {
    const controls = document.createElement('ul');
    controls.className = 'controls';
    const buttonArr = [
      'restart',
      'save',
      'top-10',
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
      button.textContent = `${capitalize(action)}: ${Controls.isMuted ? 'Off' : 'On'}`;
    } else {
      button.textContent = capitalize(action);
    }
    control.append(button);
    return control;
  }

  static toggleTheme() {
    document.body.classList.toggle('light-theme');
  }

  static displayNewGameModal() {
    // const gameModalInstance = new NewGameModal();
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
}
