import Field from './Field';
import Container from './Container';
import Controls from './Controls';

export default class Main {
  static renderMain(difficulty, mines, savedGame) {
    const main = document.createElement('main');
    const container = Container.renderContainer();
    container.classList.add('main-container');

    const fieldInstance = new Field(difficulty, mines, savedGame);
    const field = fieldInstance.renderField();
    const controls = Controls.renderControls();
    container.append(controls, field);
    main.append(container);

    return main;
  }
}
