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
      console.log('link clicked, params: ', e);
    };

    const link = new Link(
      'span',
      {
        attrs: {
          class: 'nav-container text',
        },
        url: '../../pages/chats.html',
        title: 'Войти',
        events: {
          click: linkClick,
        },
      },
    );

    const emailInput = new InputWithValidComponent('div', {
      attrs: {
        class: 'input-container',
      },
      name: 'email',
      inputType: 'text',
      errorText: 'Неверный email',
      labelText: 'Почта',
      noValid: false,
      validationType: 'email',
    });

    const fNameInput = new InputWithValidComponent('div', {
      attrs: {
        class: 'input-container',
      },
      name: 'first_name',
      inputType: 'text',
      errorText: 'Неверное имя пользователя',
      labelText: 'Имя',
      noValid: false,
      validationType: 'name',
    });

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

    const sNameInput = new InputWithValidComponent('div', {
      attrs: {
        class: 'input-container',
      },
      name: 'second_name',
      inputType: 'text',
      errorText: 'Неверная фамилия пользователя',
      labelText: 'Фамилия',
      noValid: false,
      validationType: 'name',
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
        btnText: 'Зарегистрироваться',
      },
    );

    const form = new Form('form', {
      attrs: {
        class: 'login-form',
      },
      inputs: [emailInput, fNameInput, loginInput, sNameInput, pwdInput],
      button: sendButton,
      onSubmit: (data: Record<string, string>, isValid: boolean) => {
        if (isValid) {
          console.log('Данные:', data);
        } else {
          console.log('Данные содержат ошибки');
        }
      }
    });

    return new Page(
      'div',
      {
        attrs: {
          class: 'pnl pnl__bordered',
        },
        title: 'Регистрация',
        form: form,
        link: link,
      },
    );
  }
}

const view = new LoginView();

view.renderPage();
