import { convertTextToId } from './utils';

export default class Infos {
  constructor(mines, time, moves) {
    this.values = [mines, time, moves];
  }

  renderInfos() {
    const infos = document.createElement('div');
    infos.className = 'infos';

    const textArr = ['Mines left', 'Time', 'Moves'];
    textArr.forEach((text, index) => {
      const info = Infos.renderInfo(text, this.values[index]);
      infos.append(info);
    });

    return infos;
  }

  static renderInfo(text, value) {
    const info = document.createElement('div');
    info.className = 'info';
    info.textContent = `${text}: `;

    const valueSpan = document.createElement('span');
    valueSpan.textContent = value;
    valueSpan.id = convertTextToId(text);

    if (text === 'Time') {
      info.append(valueSpan, 's');
    } else {
      info.append(valueSpan);
    }
    return info;
  }
}
