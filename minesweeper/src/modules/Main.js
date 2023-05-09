import Field from './Field';
import DifficultyBlock from './DifficultyBlock';
import Container from './Container';

export default class Main {
  static renderMain() {
    const main = document.createElement('main');
    const container = Container.renderContainer();

    const fieldInstance = new Field();
    const field = fieldInstance.renderField();

    const difficultyBlockInstance = new DifficultyBlock();
    const difficultyBlock = difficultyBlockInstance.renderDifficultiesBlock();

    container.append(field, difficultyBlock);
    main.append(container);

    return main;
  }
}
