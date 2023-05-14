import Container from './Container';
import Infos from './Infos';

export default class Header {
  constructor(mines = 10, time = 0, moves = 0, flags = 0) {
    this.value = [mines, time, moves, flags];
  }

  renderHeader() {
    const header = document.createElement('header');
    header.className = 'header';

    const container = Container.renderContainer();
    container.classList.add('header-container');
    const infosInstance = new Infos(...this.value);
    const infos = infosInstance.renderInfos();

    const burger = Infos.renderMenuButton();

    container.append(burger, infos);

    header.append(container);
    return header;
  }
}
