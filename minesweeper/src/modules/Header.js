import Container from './Container';
import Infos from './Infos';

export default class Header {
  constructor(mines = 10, time = 0, moves = 0) {
    this.value = [mines, time, moves];
  }

  renderHeader() {
    const header = document.createElement('header');
    header.className = 'header';

    const container = Container.renderContainer();

    const infosInstance = new Infos(...this.value);
    const infos = infosInstance.renderInfos();

    container.append(infos);

    header.append(container);
    return header;
  }
}
