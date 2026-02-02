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
import { Router } from '../../services/router';
import { userStore } from '../../stores/user-store';

export class LoginView extends View {
  validator: Validator;
  router: Router;
  private unsubscribers: Array<() => void> = [];

  constructor() {
    super();
    this.validator = new Validator();
    this.router = Router.getInstance('.app');

    this.unsubscribers.push(
      userStore.on('user-logged-in', () => {
        console.log('Пользователь вошел');
        this.router.go('/messenger');
      })
    );

    this.unsubscribers.push(
      userStore.on('login-error', (error) => {
        console.error('Ошибка входа:', error);
        this.showError(error);
      })
    );
  }

  private showError(message: string): void {
    const formElement = document.querySelector('.login-form');

    if (!formElement) return;

    const existingError = formElement.querySelector('.form-error');
    if (existingError) {
      existingError.remove();
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    formElement.insertBefore(errorDiv, formElement.firstChild);

    setTimeout(() => {
      errorDiv.remove();
      userStore.clearError();
    }, 5000);
  }

  getContent(): Component {
    const link = new Link('span', {
      attrs: {
        class: 'nav-container text',
      },
      url: '/sign-up',
      title: 'Нет аккаунта?',
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

    const sendButton = new Button('button', {
      attrs: {
        class: 'btn-container',
        type: 'submit',
      },
      btnText: 'Авторизоваться',
    });

    const form = new Form('form', {
      attrs: {
        class: 'login-form',
      },
      inputs: [loginInput, pwdInput],
      showSubmit: true,
      button: sendButton,
      onSubmit: async (data: Record<string, string>, isValid: boolean) => {
        if (!isValid) {
          console.log('Данные невалидны');
          return { success: false, error: 'Данные невалидны' };
        }

        console.log('Отправка данных:', data);

        const btn = sendButton.getContent() as HTMLButtonElement;
        if (btn) {
          btn.disabled = true;
          btn.textContent = 'Загрузка...';
        }

        try {
          await userStore.signIn(data);
        } catch (error) {
          console.error('Ошибка при входе:', error);
        } finally {
          if (btn) {
            btn.disabled = false;
            btn.textContent = 'Авторизоваться';
          }
        }
      },
    });

    return new Page('div', {
      attrs: {
        class: 'pnl pnl__bordered',
      },
      title: 'Вход',
      form,
      link,
    });
  }

  public hide(): void {
    // Отписываемся при скрытии страницы
    this.unsubscribers.forEach(unsubscribe => unsubscribe());
    this.unsubscribers = [];
    super.hide();
  }
}
