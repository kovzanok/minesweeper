export default class Modal {
  static renderModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';

    const modalBody = document.createElement('div');
    modalBody.className = 'modal__body';

    modal.append(modalBody);

    return modal;
  }
}
