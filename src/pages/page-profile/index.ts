import '../../assets/styles/styles.scss';
import '../../assets/styles/variables.scss';

import { View } from '../../view/view';
import { Component } from '../../components/component';
import { Link } from '../../components/link/link';
import { Page } from '../../components/page/page';
import { Button } from '../../components/button/button';
import { Form } from '../../components/form/form';
import {
  ProfileInputWithValidComponent,
} from '../../components/profile-input-with-valid/profile-input-with-valid';
import { FlatButton } from '../../components/flat-button/flat-button';
import { AvatarInput } from '../../components/avatar-input/avatar-input';

export class LoginView extends View {
  private profileInputs: ProfileInputWithValidComponent[] = [];

  private pwdInputs: ProfileInputWithValidComponent[] = [];

  private page?: Page;

  private form?: Form;

  private formPwd?: Form;

  createContent(): Component {
    const link = new Link(
      'span',
      {
        attrs: {
          class: 'link link-exit',
        },
        url: '/',
        title: 'Выйти',
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
      profileEditUserInfo: false,
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
      profileEditUserInfo: false,
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
      profileEditUserInfo: false,
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
      profileEditUserInfo: false,
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
      profileEditUserInfo: false,
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
      profileEditUserInfo: false,
    });

    const pwdOldInput = new ProfileInputWithValidComponent('div', {
      attrs: {
        class: 'input-container',
      },
      name: 'old_password',
      inputType: 'password',
      errorText: 'Неверный пароль',
      labelText: 'Старый пароль',
      noValid: false,
      validationType: 'password',
      profileEditUserInfo: true,
    });

    const pwdInput = new ProfileInputWithValidComponent('div', {
      attrs: {
        class: 'input-container',
      },
      name: 'password',
      inputType: 'password',
      errorText: 'Неверный пароль',
      labelText: 'Новый пароль',
      noValid: false,
      validationType: 'password',
      profileEditUserInfo: true,
    });

    const pwdInputConfirm = new ProfileInputWithValidComponent('div', {
      attrs: {
        class: 'input-container',
      },
      name: 'confirm_password',
      inputType: 'password',
      errorText: 'Неверный пароль',
      labelText: 'Пароль (еще раз)',
      noValid: false,
      validationType: 'password',
      profileEditUserInfo: true,
    });

    this.pwdInputs = [
      pwdOldInput,
      pwdInput,
      pwdInputConfirm,
    ];

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

          this.page?.setProps({
            hideForm: false,
            hideEditButtons: true,
            hideFormPassword: true,
          });
          this.form?.setProps({ showSubmit: true });

          this.profileInputs.forEach((input) => {
            input.setProps({ profileEditUserInfo: true });
          });
        },
      },
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

          this.page?.setProps({
            hideForm: true,
            hideEditButtons: true,
            hideFormPassword: false,
          });

          this.formPwd?.setProps({ showSubmit: true });
        },
      },
    });

    const sendButton = new Button(
      'button',
      {
        attrs: {
          class: 'btn-container',
          type: 'submit',
        },
        btnText: 'Сохранить',
      },
    );

    const sendButtonPwd = new Button(
      'button',
      {
        attrs: {
          class: 'btn-container',
          type: 'submit',
        },
        btnText: 'Сохранить',
      },
    );

    this.formPwd = new Form('form', {
      attrs: {
        class: 'login-form',
      },
      inputs: [pwdOldInput, pwdInput, pwdInputConfirm],
      button: sendButtonPwd,
      showSubmit: false,
      onSubmit: (data: Record<string, string>, isValid: boolean) => {
        if (isValid) {
          console.log('Данные:', data);

          this.page?.setProps({
            hideForm: false,
            hideEditButtons: false,
            hideFormPassword: true,
          });
          this.formPwd?.setProps({ showSubmit: false });

          this.pwdInputs.forEach((input) => {
            input.setProps({ profileEditUserInfo: false });
          });
        } else {
          console.log('Данные содержат ошибки');
        }
      },
    });

    const customAvatar = new AvatarInput({
      attrs: {
        class: 'avatar-container',
      },
      inputId: 'customAvatarInput',
      inputName: 'avatar',
      onChange: (file: File | null) => {
        if (!file) {
          return;
        }

        if (!file.type.startsWith('image/')) {
          alert('Пожалуйста, выберите изображение');
          customAvatar.clearFile();
        } else {
          console.log('Выбран файл:', file.name);
        }
      },
    });

    this.form = new Form('form', {
      attrs: {
        class: 'login-form',
      },
      avatar: customAvatar,
      inputs: [emailInput, fNameInput, loginInput, sNameInput, displayNameInput, phoneInput],
      button: sendButton,
      showSubmit: false,
      onSubmit: (data: Record<string, string>, isValid: boolean) => {
        if (isValid) {
          console.log('Данные:', data);

          this.page?.setProps({
            hideForm: false,
            hideEditButtons: false,
            hideFormPassword: true,
          });
          this.form?.setProps({ showSubmit: false });

          this.profileInputs.forEach((input) => {
            input.setProps({ profileEditUserInfo: false });
          });
        } else {
          console.log('Данные содержат ошибки');
        }
      },
    });

    this.page = new Page(
      'div',
      {
        attrs: {
          class: 'app pnl-props-container-profile',
        },
        title: 'Профиль пользователя',
        form: this.form,
        formPassword: this.formPwd,
        editButton,
        editPassword,
        link,
        hideForm: false,
        hideEditButtons: false,
        hideFormPassword: true,
      },
    );

    return this.page;
  }
}

const view = new LoginView();

view.renderPage();
