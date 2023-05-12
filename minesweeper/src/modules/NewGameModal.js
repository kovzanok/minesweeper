import Modal from './Modal';
import DifficultyBlock from './DifficultyBlock';

export default class NewGameModal extends Modal {
  static render() {
    const modal = Modal.renderModal();
    const content = NewGameModal.renderContent();
    const button = NewGameModal.renderNewGameButton();
    button.addEventListener('click', NewGameModal.startNewGame);
    modal.querySelector('.modal__body').append(content, button);

    return modal;
  }

  static renderContent() {
    const difficultyBlockInstance = new DifficultyBlock();
    const difficultyBlock = difficultyBlockInstance.renderDifficultiesBlock();

    return difficultyBlock;
  }

  static renderNewGameButton() {
    const button = document.createElement('button');
    button.className = 'button button_new-game';
    button.textContent = 'Start game';
    return button;
  }

  static startNewGame(e) {
    const modalBody = e.target.closest('.modal__body');
    const [difficulty, mines] = NewGameModal.getDataFromModalBody(modalBody);
    const startNewGameEvent = new CustomEvent('newGame', {
      detail: [difficulty, mines],
    });
    window.dispatchEvent(startNewGameEvent);
  }

  static getDataFromModalBody(modalBody) {
    const { difficulty } = modalBody.querySelector('.button_active').dataset;
    const mines = Number(modalBody.querySelector('input').value);
    return [difficulty, mines];
  }
}
