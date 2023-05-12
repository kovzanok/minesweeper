export default class Modal {
  static renderModal() {
    const modal = document.createElement('div');

    modal.addEventListener('click', Modal.removeModal);
    modal.className = 'modal';
    window.dispatchEvent(new Event('timerPause'));
    const modalBody = document.createElement('div');
    modalBody.className = 'modal__body';

    modal.append(modalBody);

    return modal;
  }

  static removeModal(e) {
    if (
      !e.target.classList.contains('modal__body')
      && !e.target.closest('.modal__body')
    ) {
      window.dispatchEvent(new Event('timerGo'));
      e.target.remove();
    }
  }
}
