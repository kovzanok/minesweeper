import Modal from './Modal';

export default class ResultsModal extends Modal {
  static render(innerInfo) {
    const modal = Modal.renderModal();
    const content = ResultsModal.renderContent(innerInfo);
    const button = ResultsModal.renderBackButton();

    button.addEventListener('click', () => {
      window.dispatchEvent(new Event('timerGo'));
      modal.remove();
    });
    modal.querySelector('.modal__body').append(content, button);
    return modal;
  }

  static renderBackButton() {
    const button = document.createElement('button');
    button.className = 'button button_back';
    button.textContent = 'Back';
    return button;
  }

  static renderContent() {
    const savedResults = JSON.parse(
      localStorage.getItem('savedResults') || '[]',
    );
    savedResults.reverse();
    const headArr = ['№', 'Time', 'Mines', 'Difficulty', 'Moves'];
    const table = document.createElement('table');
    const head = document.createElement('thead');
    headArr.forEach((item) => {
      const th = document.createElement('th');
      th.textContent = item;
      head.append(th);
    });
    table.append(head);
    table.className = 'modal-table';
    savedResults.forEach((result, index) => {
      const row = document.createElement('tr');
      const indexTd = document.createElement('td');
      indexTd.textContent = `${index + 1}.`;
      row.append(indexTd);
      Object.values(result).forEach((value, valueIndex) => {
        const td = document.createElement('td');
        td.textContent = valueIndex === 0 ? `${value}s` : value;
        row.append(td);
      });
      table.append(row);
    });
    return table;
  }
}
