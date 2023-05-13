import { capitalize } from './utils';

export default class DifficultyBlock {
  constructor(currentDifficulty = 'medium') {
    this.difficulty = currentDifficulty;
    this.difficulties = ['easy', 'medium', 'hard'];
  }

  renderDifficultiesBlock() {
    const block = document.createElement('div');
    block.className = 'difficulty-block';
    block.append('Change difficulty:');

    const list = this.renderDifficultiesList();
    const input = DifficultyBlock.renderMinesNumberInput();
    block.append(list, input);

    return block;
  }

  renderDifficultiesList() {
    const list = document.createElement('ul');
    list.className = 'difficulty-list';

    this.difficulties.forEach((difficulty) => {
      const listItem = this.renderDifficultyListItem(difficulty);
      list.append(listItem);
    });

    list.addEventListener('click', DifficultyBlock.changeDifficulties);
    return list;
  }

  renderDifficultyListItem(difficultyValue) {
    const listItem = document.createElement('li');
    listItem.className = 'difficulty';

    const button = document.createElement('button');
    button.className = `button ${
      difficultyValue === this.difficulty ? 'button_active' : ''
    }`;
    button.setAttribute('data-difficulty', difficultyValue);

    button.textContent = capitalize(difficultyValue);

    listItem.append(button);
    return listItem;
  }

  static renderMinesNumberInput() {
    const input = document.createElement('input');
    input.className = 'mines-input';
    input.id = 'mines';
    input.type = 'number';
    input.min = 10;
    input.max = 99;
    input.value = 10;

    input.addEventListener('input', DifficultyBlock.validateNumberInput);
    input.addEventListener('change', DifficultyBlock.insertMinValue);
    const label = document.createElement('label');
    label.for = 'mines';
    label.textContent = 'Mines:';

    label.append(input);
    return label;
  }

  static validateNumberInput(e) {
    const input = e.target;
    if (input.value.length >= 3) {
      input.value = input.value.slice(0, 2);
    }
  }

  static insertMinValue(e) {
    const input = e.target;
    if (Number(input.value) <= 0) {
      input.value = 10;
    }
  }

  static changeDifficulties(e) {
    if ((e.target.classList.contains('button'))) {
      const list = e.target.closest('ul');
      const activeButton = list.querySelector('.button_active');
      activeButton.classList.remove('button_active');
      e.target.classList.add('button_active');
    }
  }
}
