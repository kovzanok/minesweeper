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
    block.append(list);

    return block;
  }

  renderDifficultiesList() {
    const list = document.createElement('ul');
    list.className = 'difficulty-list';

    this.difficulties.forEach((difficulty) => {
      const listItem = this.renderDifficultyListItem(difficulty);
      list.append(listItem);
    });

    return list;
  }

  renderDifficultyListItem(difficultyValue) {
    const listItem = document.createElement('li');
    listItem.className = 'difficulty';

    const button = document.createElement('button');
    button.className = `button ${
      difficultyValue === this.difficulty ? 'button_active' : ''
    }`;
    button.setAttribute('difficulty', difficultyValue);

    button.textContent = capitalize(difficultyValue);

    listItem.append(button);
    return listItem;
  }
}
