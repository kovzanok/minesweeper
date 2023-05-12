import Field from './Field';
import Container from './Container';

export default class Main {
  static renderMain(difficulty, mines, savedGame) {
    const main = document.createElement('main');
    const container = Container.renderContainer();

    const fieldInstance = new Field(difficulty, mines, savedGame);
    const field = fieldInstance.renderField();

    container.append(field);
    main.append(container);

    return main;
  }
}
