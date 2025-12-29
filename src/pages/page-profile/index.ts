import '../../assets/styles/styles.scss';
import '../../assets/styles/variables.scss';

import { View } from '../../view/view';
import { Component } from '../../components/component';
import { Link } from '../../components/link/link';
import { Page } from '../../components/page/page';
import { Button } from '../../components/button/button';
import { Form } from '../../components/form/form';
import { ProfileInputWithValidComponent } from '../../components/profile-input-with-valid/profile-input-with-valid';
import { FlatButton } from '../../components/flat-button/flat-button';

export class LoginView extends View {
  private profileEditUserInfo: boolean = false;
  private profileInputs: ProfileInputWithValidComponent[] = [];
  private passwordEditFormVisible = true;
  private page?: Page;
  private form?: Form;

  constructor() {
    super();
  }

  createContent(): Component {
    const linkClick = (e: Event) => {
      console.log('link clicked, params: ', e);
    };

    const link = new Link(
      'span',
      {
        attrs: {
          class: 'link link-exit',
        },
        url: '/',
        title: 'Выйти',
        events: {
          click: linkClick,
        },
      },
    );

    const emailInput = new ProfileInputWithValidComponent('div', {
      attrs: {
        class: 'input-container',
      },
      name: 'email',
      inputType: 'text',
      errorText: 'Неверный email',
      labelText: 'Почта',
      noValid: false,
      validationType: 'email',
      value: 'pochta@yandex.ru',
      profileEditUserInfo: this.profileEditUserInfo,
    });

    const loginInput = new ProfileInputWithValidComponent('div', {
      attrs: {
        class: 'input-container',
      },
      name: 'login',
      inputType: 'text',
      errorText: 'Неверный логин',
      labelText: 'Логин',
      noValid: false,
      validationType: 'login',
      value: 'Irina666',
      profileEditUserInfo: this.profileEditUserInfo,
    });

    const fNameInput = new ProfileInputWithValidComponent('div', {
      attrs: {
        class: 'input-container',
      },
      name: 'first_name',
      inputType: 'text',
      errorText: 'Неверное имя пользователя',
      labelText: 'Имя',
      noValid: false,
      validationType: 'name',
      value: 'Ирина',
      profileEditUserInfo: this.profileEditUserInfo,
    });

    const sNameInput = new ProfileInputWithValidComponent('div', {
      attrs: {
        class: 'input-container',
      },
      name: 'second_name',
      inputType: 'text',
      errorText: 'Неверная фамилия пользователя',
      labelText: 'Фамилия',
      noValid: false,
      validationType: 'name',
      value: 'Шаблий',
      profileEditUserInfo: this.profileEditUserInfo,
    });

    const displayNameInput = new ProfileInputWithValidComponent('div', {
      attrs: {
        class: 'input-container',
      },
      name: 'display_name',
      inputType: 'text',
      errorText: 'Неверое имя',
      labelText: 'Имя в чате',
      noValid: false,
      validationType: 'name',
      value: 'Ирина (как в чате)',
      profileEditUserInfo: this.profileEditUserInfo,
    });

    const phoneInput = new ProfileInputWithValidComponent('div', {
      attrs: {
        class: 'input-container',
      },
      name: 'phone',
      inputType: 'text',
      errorText: 'Неверный телефон',
      labelText: 'Телефон',
      noValid: false,
      validationType: 'phone',
      value: '88888888888',
      profileEditUserInfo: this.profileEditUserInfo,
    });

    /*const pwdInput = new InputWithValidComponent('div', 'input-container-value', {
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
    });*/

    this.profileInputs = [
      emailInput,
      fNameInput,
      loginInput,
      sNameInput,
      displayNameInput,
      phoneInput,
    ];

    const editButton = new FlatButton('button', {
      attrs: {
        type: 'button',
        class: 'flat-btn-container',
      },
      btnText: 'Изменить данные',
      events: {
        click: (e: Event) => {
          e.preventDefault();

          this.profileEditUserInfo = true;

          this.page?.setProps({ hideEditButtons: true });
          this.form?.setProps({ showSubmit: true });

          this.profileInputs.forEach(input => {
            input.setProps({ profileEditUserInfo: true });
          });
        }
      }
    });

    const editPassword = new FlatButton('button', {
      attrs: {
        type: 'button',
        class: 'flat-btn-container',
      },
      btnText: 'Изменить пароль',
      visible: true,
      events: {
        click: (e: Event) => {
          e.preventDefault();

          this.page?.setProps({ hideEditButtons: true });
          this.form?.setProps({ showSubmit: true });

        }
      }
    });

    const sendButton = new Button (
      'button',
      {
        attrs: {
          class: 'btn-container',
          type: 'submit',
        },
        btnText: 'Сохранить',
      },
    );

    this.form = new Form('form', {
      attrs: {
        class: 'login-form',
      },
      inputs: [emailInput, fNameInput, loginInput, sNameInput, displayNameInput, phoneInput],
      button: sendButton,
      showSubmit: false,
      onSubmit: (data: Record<string, string>, isValid: boolean) => {
        if (isValid) {
          console.log('Данные:', data);

          this.profileEditUserInfo = false;
          this.page?.setProps({ hideEditButtons: false }); // показываем кнопки обратно
          this.form?.setProps({ showSubmit: false }); // скрываем кнопку сохранения

          this.profileInputs.forEach(input => {
            input.setProps({ profileEditUserInfo: false }); // выключаем редактирование
          });
        } else {
          console.log('Данные содержат ошибки');
        }
      }
    });

    this.page = new Page(
      'div',
      {
        attrs: {
          class: 'app pnl-props-container-profile',
        },
        title: 'Профиль пользователя',
        form: this.form,
        editButton: editButton,
        editPassword: editPassword,
        link: link,
        hideEditButtons: false,
        passwordEditFormVisible: this.passwordEditFormVisible,
      },
    );

    return this.page;
  }
}

const view = new LoginView();

view.renderPage();
