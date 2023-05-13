import Modal from './Modal';

export default class MessageModal extends Modal {
  static render(innerInfo) {
    const modal = Modal.renderModal();
    const content = MessageModal.renderContent(innerInfo);
    const button = MessageModal.renderBackButton();

    button.addEventListener('click', () => modal.remove());
    modal.querySelector('.modal__body').append(content, button);
    return modal;
  }

  static renderContent(innerInfo) {
    const content = document.createElement('div');
    content.className = 'message-body';
    const { win } = innerInfo;
    if (win) {
      const heading = document.createElement('h2');
      heading.textContent = `Hooray! You found all mines in ${innerInfo.time} seconds and ${innerInfo.moves} moves!`;

      // const wrapper = document.createElement('div');
      // wrapper.className = 'wrapper';
      // const timeSpan = document.createElement('span');
      // timeSpan.textContent = `Time: ${innerInfo.time}s`;

      // const movesSpan = document.createElement('span');
      // movesSpan.textContent = `Moves: ${innerInfo.moves}`;
      // wrapper.append(timeSpan, movesSpan);
      content.append(heading);
    } else {
      const heading = document.createElement('h2');
      heading.textContent = 'Your life ends in a wasteland... Game over. Try again';
      content.append(heading);
    }
    return content;
  }

  static renderBackButton() {
    const button = document.createElement('button');
    button.className = 'button button_back';
    button.textContent = 'Back';
    return button;
  }
}
