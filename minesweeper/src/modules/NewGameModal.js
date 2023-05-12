import Modal from './Modal';
import DifficultyBlock from './DifficultyBlock';

export default class NewGameModal extends Modal {
  static render() {
    const modal = Modal.renderModal();
    const content = NewGameModal.renderContent();
    const button = NewGameModal.renderNewGameButton();
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
}
