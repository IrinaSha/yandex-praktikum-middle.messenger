import './modal.scss';
import '../../assets/styles/variables.scss';

import { Component } from '../component';
import { Button } from '../button/button';
import { tmpl } from './tmpl';

export class Modal extends Component {
  constructor(props: {
    title: string;
    placeholder: string;
    onConfirm: (value: string) => void;
    onClose: () => void;
  }) {
    const submitBtn = new Button('button', {
      attrs: { class: 'btn-container' },
      btnText: 'Подтвердить',
      events: {
        click: () => {
          const input = this.getContent()?.querySelector('#modal-input') as HTMLInputElement;
          props.onConfirm(input.value);
        },
      },
    });

    const cancelBtn = new Button('button', {
      attrs: { class: 'btn-container btn-secondary' },
      btnText: 'Отмена',
      events: {
        click: () => props.onClose(),
      },
    });

    super('div', {
      ...props,
      submitBtn,
      cancelBtn,
      attrs: { class: 'modal' },
    });
  }

  render() {
    return this.compile(tmpl);
  }
}
