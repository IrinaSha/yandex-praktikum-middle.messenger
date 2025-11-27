import '../../assets/styles/styles.scss';
import '../../assets/styles/variables.scss';

import { View } from '../../view/view';
import { Component } from '../../components/component';
import { Link } from '../../components/link/link';
import { Page } from '../../components/page/page';
import { Button } from '../../components/button/button';
import { InputComponent } from '../../components/login-input/login-input';

export class LoginView extends View {
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

    const inputLogin = new InputComponent(
      'div',
      {
        attrs: {
          class: 'input-container',
        },
        name: 'login',
        inputType: 'text',
        errorText: 'Неверный логин',
        labelText: 'Логин',
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

    return new Page(
      'div',
      {
        attrs: {
          class: 'pnl pnl__bordered',
        },
        title: 'Вход',
        // form: form,
        inputLogin,
        inputPwd,
        link,
        sendButton,
      },
    );
  }
}

const view = new LoginView();

view.renderPage();
