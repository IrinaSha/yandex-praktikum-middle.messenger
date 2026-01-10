import './assets/styles/styles.scss';
import './assets/styles/variables.scss';
import './components/error-block/error-block.scss';
import './components/button/button.scss';
import './components/flat-button/flat-button.scss';
import './components/nav/nav.scss';

import { Component } from './components/component';
import { Layout } from './components/layout/layout';
import { Nav } from './components/nav/nav';
import { Link } from './components/link/link';
import { View } from './view/view';

export class MainView extends View {
  createContent(): Component {
    const nav = new Nav(
      {
        attrs: {
          class: 'nav',
        },
        links: [
          new Link('li', { url: '/pages/page-error400/page.html', title: 'Ошибка 4**' }),
          new Link('li', { url: '/pages/page-error500/page.html', title: 'Ошибка 5**' }),
          new Link('li', { url: '/pages/page-login/page.html', title: 'Авторизация' }),
          new Link('li', { url: '/pages/page-registration/page.html', title: 'Регистрация' }),
          new Link('li', { url: '/pages/page-chats/page.html', title: 'Чаты' }),
          new Link('li', { url: '/pages/page-profile/page.html', title: 'Профиль пользователя' }),
        ],
      },
    );

    return new Layout(
      'div',
      {
        attrs: {
          class: 'layout',
        },
        title: 'Главная страница',
        nav,
      },
    );
  }
}

const view = new MainView();

view.renderPage();
