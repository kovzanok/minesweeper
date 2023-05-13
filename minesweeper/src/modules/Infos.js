import { convertTextToId } from './utils';
import flagMode from '../assets/mp3/flagMode.mp3';
import Controls from './Controls';

export default class Infos {
  static isFlagMode = false;

  constructor(mines, time, moves) {
    this.values = [mines, time, moves];
  }

  renderInfos() {
    Infos.isFlagMode = false;
    const infos = document.createElement('div');
    infos.className = 'infos';

    const textArr = ['Mines left', 'Time', 'Moves', 'Flag'];
    textArr.forEach((text, index) => {
      const info = Infos.renderInfo(text, this.values[index]);
      infos.append(info);
    });

    return infos;
  }

  static renderInfo(text, value) {
    const info = document.createElement('div');
    info.className = 'info';
    if (text === 'Flag') {
      const button = Infos.renderFlagButton();
      info.append(button);
    } else {
      info.textContent = `${text}: `;

      const valueSpan = document.createElement('span');
      valueSpan.textContent = value;
      valueSpan.id = convertTextToId(text);

      if (text === 'Time') {
        info.append(valueSpan, 's');
      } else {
        info.append(valueSpan);
      }
    }

    return info;
  }

  static renderFlagButton() {
    const button = document.createElement('button');
    button.className = 'button button_flag';
    button.addEventListener('click', Infos.toggleFlagMode);
    return button;
  }

  static toggleFlagMode(e) {
    if (!Controls.isMuted) {
      const sound = new Audio(flagMode);
      sound.play();
    }
    const button = e.target;
    button.classList.toggle('button_flag-active');
    Infos.isFlagMode = !Infos.isFlagMode;
  }

  static renderMenuButton() {
    const button = document.createElement('button');
    button.className = 'button button_menu';
    button.textContent = 'Menu';
    button.addEventListener('click', Infos.showMenu);
    return button;
  }

  static showMenu() {
    const background = Controls.renderBackground();
    const mainContainer = document.querySelector('.main-container');
    mainContainer.append(background);
    document
      .querySelector('.controls-wrapper')
      .classList.add('controls-wrapper_active');
  }
}
