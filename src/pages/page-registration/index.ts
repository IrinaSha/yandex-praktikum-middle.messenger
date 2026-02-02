import { View } from '../../view/view';
import { Component } from '../../components/component';
import { Link } from '../../components/link/link';
import { Page } from '../../components/page/page';
import { Button } from '../../components/button/button';
import { Validator } from '../../services/validator';
import { InputWithValidComponent } from '../../components/input-with-valid/input-with-valid';
import { Form } from '../../components/form/form';
import { UserApi } from '../../api/user-api';
import type { SignUpData } from '../../api/user-api';

import '../../assets/styles/styles.scss';
import '../../assets/styles/variables.scss';
import { Router } from '../../services/router.ts';

export class RegistrationView extends View {
  validator: Validator;
  userApi: UserApi;
  router: Router;

  constructor() {
    super();

    this.validator = new Validator();
    this.userApi = new UserApi();
    this.router = Router.getInstance('.app');
  }

  getContent(): Component {
    const link = new Link(
      'span',
      {
        attrs: {
          class: 'nav-container text',
        },
        url: '../page-chats/page.html',
        title: 'Войти',
      },
    );

    const emailInput = new InputWithValidComponent('div', 'input-container-value', {
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

    const fNameInput = new InputWithValidComponent('div', 'input-container-value', {
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

    const sNameInput = new InputWithValidComponent('div', 'input-container-value', {
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

    const phoneInput = new InputWithValidComponent('div', 'input-container-value', {
      attrs: {
        class: 'input-container',
      },
      name: 'phone',
      inputType: 'text',
      errorText: 'Неверный телефон',
      labelText: 'Телефон',
      noValid: false,
      validationType: 'phone',
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

    const pwdInputConfirm = new InputWithValidComponent('div', 'input-container-value', {
      attrs: {
        class: 'input-container',
      },
      name: 'confirm_password',
      inputType: 'password',
      errorText: 'Неверный пароль',
      labelText: 'Пароль (еще раз)',
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
        btnText: 'Зарегистрироваться',
      },
    );

    const form = new Form('form', {
      attrs: {
        class: 'login-form',
      },
      inputs: [
        emailInput,
        fNameInput,
        loginInput,
        sNameInput,
        phoneInput,
        pwdInput,
        pwdInputConfirm,
      ],
      showSubmit: true,
      button: sendButton,
      onSubmit: async (data: Record<string, string>, isValid: boolean) => {
        if (isValid) {
          console.log('Данные:', data);

          if (data.password !== data.confirm_password) {
            alert('Пароли не совпадают');

            return;
          }

          const signUpData: SignUpData = {
            first_name: data.first_name,
            second_name: data.second_name,
            login: data.login,
            email: data.email,
            password: data.password,
            phone: data.phone,
          };

          try {
            const response = await this.userApi.signUp(signUpData);

            console.log('Регистрация успешна:', response);
            this.router.go('/messenger');

          } catch (error) {
            alert('Ошибка регистрации. Попробуйте снова.');
          }
        } else {
          console.log('Данные содержат ошибки');
        }
      },
    });

    return new Page(
      'div',
      {
        attrs: {
          class: 'app pnl-props-container-profile',
        },
        title: 'Регистрация',
        form,
        link,
      },
    );
  }
}

//const view = new RegistrationView();

//view.renderPage();
