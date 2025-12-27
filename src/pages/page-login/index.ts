import '../../assets/styles/styles.scss';
import '../../assets/styles/variables.scss';

import { View } from '../../view/view';
import { Component } from '../../components/component';
import { Link } from '../../components/link/link';
import { Page } from '../../components/page/page';
import { Button } from '../../components/button/button';
import { InputComponent } from '../../components/login-input/login-input';
import { Validator } from '../../services/validator';
import { InputWithValidComponent } from '../../components/input-with-valid/input-with-valid';

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

    const btnClick = (e: Event) => {
      console.log('blur btn clicked, params: ', e);
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

    const sendButton = new Button (
      'button',
      {
        attrs: {
          class: 'btn-container',
          type: 'submit',
        },
        btnText: 'Авторизоваться',
        events: {
          blur: btnClick
        },
      },
    );

    const inputPwd = new InputComponent(
      'div',
      {
        attrs: {
          class: 'input-container',
        },
        name: 'password',
        inputType: 'password',
        errorText: 'Неверный пароль',
        labelText: 'Пароль',
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
      errorText: 'Неверный пароль!!',
      labelText: 'Пароль',
      noValid: false,
      validationType: 'password',
    });

    return new Page(
      'div',
      {
        attrs: {
          class: 'pnl pnl__bordered',
        },
        title: 'Вход',
        // form: form,
        inputLogin: loginInput,
        inputPwd: pwdInput,
        link,
        sendButton,
      },
    );
  }
}

const view = new LoginView();

view.renderPage();
