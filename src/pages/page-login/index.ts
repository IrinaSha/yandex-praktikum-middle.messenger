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

  getContent(): Component {
    const link = new Link(
      'span',
      {
        attrs: {
          class: 'nav-container text',
        },
        url: '../page-registration/page.html',
        title: 'Нет аккаунта?',
      },
    );

    const loginInput = new InputWithValidComponent('div', 'input-container-value', {
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

    const pwdInput = new InputWithValidComponent('div', 'input-container-value', {
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

    const sendButton = new Button(
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
      showSubmit: true,
      button: sendButton,
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
        title: 'Вход',
        form,
        link,
      },
    );
  }
}

const view = new LoginView();

view.renderPage();
