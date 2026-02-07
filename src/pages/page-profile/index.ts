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
import { tmpl } from './tmpl';

import '../../assets/styles/styles.scss';
import '../../assets/styles/variables.scss';
import { userStore } from '../../stores/user-store.ts';
import { BASE_URL } from '../../api/consts.ts';
import { Nav } from '../../components/nav/nav';

export class ProfileView extends View {
  private profileInputs: ProfileInputWithValidComponent[] = [];

  private pwdInputs: ProfileInputWithValidComponent[] = [];

  private page?: Page;

  private form?: Form;

  private formPwd?: Form;

  private customAvatar?: AvatarInput;

  getContent(): Component {
    const linkLogout = new Link(
      'li',
      {
        attrs: {
          class: 'link link-exit',
        },
        url: '/sign-up',
        title: 'Выйти',
        events: {
          click: async () => {
            await userStore.logout();
          }
        }
      },
    );

    const nav = new Nav(
      {
        attrs: {
          class: 'nav',
        },
        links: [
          new Link('li', { attrs: { class: 'link link-exit' }, url: '/', title: 'На главную' }),
          linkLogout,
        ],
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
      value: '',
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
      value: '',
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
      value: '',
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
      value: '',
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
      value: '',
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
      value: '',
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
          e.stopPropagation();

          this.page?.setProps({
            hideForm: false,
            hideEditButtons: true,
            hideFormPassword: true,
          });

          const user = userStore.getUser();

          if (user) {
            this.profileInputs.forEach((input) => {
              const name = input.getName();

              if (name && name in user) {
                const value = user[name as keyof typeof user];

                input.setProps({
                  attrs: {
                    ...input.props.attrs,
                    value: value || '',
                  },
                  profileEditUserInfo: true
                });
              }
            });
          }

          this.form?.setProps({ showSubmit: true });

          this.rerender(this.page);
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
          e.stopPropagation();

          this.page?.setProps({
            hideForm: true,
            hideEditButtons: true,
            hideFormPassword: false,
          });

          this.formPwd?.setProps({ showSubmit: true });

          this.rerender(this.page);
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
      onSubmit: async (data: Record<string, string>, isValid: boolean) => {
        if (isValid) {
          console.log('Данные:', data);
          try {

            await userStore.updatePassword({ oldPassword: data.old_password, newPassword: data.password });

            this.page?.setProps({
              hideForm: false,
              hideEditButtons: false,
              hideFormPassword: true,
            });
            this.formPwd?.setProps({ showSubmit: false });

            this.pwdInputs.forEach((input) => {
              input.setProps({ profileEditUserInfo: false });
            });
          } catch (error: any) {
            console.error('Ошибка обновления профиля:', error);
            alert(error.reason || 'Не удалось обновить профиль');
          }
        } else {
          console.log('Данные содержат ошибки');
        }
      },
    });

    this.customAvatar = new AvatarInput({
      attrs: {
        class: 'avatar-container',
      },
      inputId: 'customAvatarInput',
      inputName: 'avatar',
      onChange: async (file: File | null) => {
        if (!file) {
          return;
        }

        if (!file.type.startsWith('image/')) {
          alert('Пожалуйста, выберите изображение');
          this.customAvatar?.clearFile();
          return;
        }

        try {
          await userStore.updateAvatar(file);
          console.log('Аватар успешно обновлен');
        } catch (error: any) {
          console.error('Ошибка обновления аватара:', error);
          alert(error.reason || 'Не удалось обновить аватар');
          this.customAvatar?.clearFile();
        }
      },
    });

    this.form = new Form('form', {
      attrs: {
        class: 'login-form',
      },
      avatar: this.customAvatar,
      inputs: [emailInput, fNameInput, loginInput, sNameInput, displayNameInput, phoneInput],
      button: sendButton,
      showSubmit: false,
      onSubmit: async (data: Record<string, string>, isValid: boolean) => {
        if (isValid) {
          try {
            await userStore.updateProfile({
              first_name: data.first_name,
              second_name: data.second_name,
              display_name: data.display_name,
              login: data.login,
              email: data.email,
              phone: data.phone,
              password: ''
            });
            console.log('Профиль успешно обновлен. Данные:', data);

            this.page?.setProps({
              hideForm: false,
              hideEditButtons: false,
              hideFormPassword: true,
            });
            this.form?.setProps({ showSubmit: false });

            this.profileInputs.forEach((input) => {
              input.setProps({ profileEditUserInfo: false });
            });
          } catch (error: any) {
            console.error('Ошибка обновления профиля:', error);
            alert(error.reason || 'Не удалось обновить профиль');
          }
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
        template: tmpl,
        title: 'Профиль пользователя',
        login: '',
        form: this.form,
        formPassword: this.formPwd,
        editButton,
        editPassword,
        nav,
        hideForm: false,
        hideEditButtons: false,
        hideFormPassword: true,
      },
    );

    userStore.on('state-changed', () => {
      this.updateUserData();
    });

    userStore.fetchUser()
      .catch((error) => {
        console.error('Ошибка загрузки данных пользователя:', error);
      });

    return this.page;
  }

  private updateUserData(): void {
    const user = userStore.getUser();

    if (!user) {
      return;
    }

    this.page?.setProps({login: user.login});

    this.profileInputs.forEach((input) => {
      const name = input.getName();

      if (name && name in user) {
        input.setProps({ value: user[name as keyof typeof user] });
      }
    });

    if (user.avatar && this.customAvatar) {
      const avatarUrl = `${BASE_URL}/resources${user.avatar}`;
      this.customAvatar.setProps({ avatar: avatarUrl });
    }
  }
}
