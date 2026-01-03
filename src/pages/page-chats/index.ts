import '../../assets/styles/styles.scss';
import '../../assets/styles/variables.scss';

import { View } from '../../view/view';
import { Component } from '../../components/component';
import { Link } from '../../components/link/link';
import { Page } from '../../components/page/page';
import { Button } from '../../components/button/button';
import { Validator } from '../../services/validator';
import { InputWithValidComponent } from '../../components/input-with-valid/input-with-valid';
import { Form } from '../../components/form/form';

export class ChatsView extends View {
  validator: Validator;

  constructor() {
    super();

    this.validator = new Validator();
  }

  createContent(): Component {
    const link = new Link(
      'span',
      {
        attrs: {
          class: 'nav-container text',
        },
        url: '/',
        title: 'Назад',
      },
    );

    const loginInput = new InputWithValidComponent('div', 'input-container-value', {
      attrs: {
        class: 'input-container',
      },
      name: 'message',
      inputType: 'text',
      errorText: 'Сообщение не может быть пустым',
      labelText: 'Сообщение',
      noValid: false,
      validationType: 'message',
    });

    const sendButton = new Button(
      'button',
      {
        attrs: {
          class: 'btn-container',
          type: 'submit',
        },
        btnText: 'Отправить',
      },
    );

    const form = new Form('form', {
      attrs: {
        class: 'login-form',
      },
      inputs: [loginInput],
      button: sendButton,
      showSubmit: true,
      onSubmit: (data: Record<string, string>, isValid: boolean) => {
        if (isValid) {
          console.log('Данные:', data);
        } else {
          console.log('Данные невалидны');
        }
      },
    });

    return new Page(
      'div',
      {
        attrs: {
          class: 'pnl pnl__bordered',
        },
        title: 'Сообщения',
        form,
        link,
      },
    );
  }
}

const view = new ChatsView();

view.renderPage();
