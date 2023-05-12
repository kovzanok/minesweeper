import { capitalize } from './utils';

export default class Controls {
  static renderControls() {
    const controls = document.createElement('ul');
    controls.className = 'controls';
    const buttonArr = ['restart', 'save', 'top-10', 'toggle', 'new game'];

    buttonArr.forEach((buttonAction) => {
      const control = Controls.renderControl(buttonAction);
      if (buttonAction === 'toggle') {
        control.addEventListener('click', Controls.toggleTheme);
      }
      controls.append(control);
    });

    return controls;
  }

  static renderControl(action) {
    const control = document.createElement('li');
    control.className = 'control';

    const button = document.createElement('button');
    button.className = 'button button_control';
    button.setAttribute('action', action);
    button.textContent = capitalize(action);

    control.append(button);
    return control;
  }

  static toggleTheme() {
    document.body.classList.toggle('light-theme');
  }
}
