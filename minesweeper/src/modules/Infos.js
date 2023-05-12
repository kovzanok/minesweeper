import { convertTextToId } from './utils';

export default class Infos {
  constructor(time, moves) {
    this.values = [time, moves];
  }

  renderInfos() {
    const infos = document.createElement('div');
    infos.className = 'infos';

    const textArr = ['Time', 'Moves'];
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

    info.append(valueSpan);
    return info;
  }
}
