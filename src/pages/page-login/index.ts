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

export class LoginView extends View {
  validator: Validator;

  constructor() {
    super();

    this.validator = new Validator();
  }

  createContent(): Component {
    const linkClick = (e: Event) => {
      console.log('login link clicked, params: ', e);
    };

    const link = new Link(
      'span',
      {
        attrs: {
          class: 'nav-container text',
        },
        url: '../../pages/registration.html',
        title: 'Нет аккаунта?',
        events: {
          click: linkClick,
        },
      },
    );

    const loginInput = new InputWithValidComponent('div', {
      attrs: {
        class: 'input-container',
      },
      name: 'login',
      inputType: 'text',
      errorText: 'Неверный логин',
      labelText: 'Логин',
      noValid: false,
      validationType: 'login',
    });

    const pwdInput = new InputWithValidComponent('div', {
      attrs: {
        class: 'input-container',
      },
      name: 'password',
      inputType: 'password',
      errorText: 'Неверный пароль',
      labelText: 'Пароль',
      noValid: false,
      validationType: 'password',
    });

    const sendButton = new Button (
      'button',
      {
        attrs: {
          class: 'btn-container',
          type: 'submit',
        },
        btnText: 'Авторизоваться',
      },
    );

    const form = new Form('form', {
      attrs: {
        class: 'login-form',
      },
      inputs: [loginInput, pwdInput],
      button: sendButton,
      onSubmit: (data: Record<string, string>, isValid: boolean) => {
        if (isValid) {
          console.log('Форма валидна. Данные:', data);
        } else {
          console.log('Форма невалидна');
        }
      }
    });

    return new Page(
      'div',
      {
        attrs: {
          class: 'pnl pnl__bordered',
        },
        title: 'Вход',
        form: form,
        link: link,
      },
    );
  }
}

const view = new LoginView();

view.renderPage();
