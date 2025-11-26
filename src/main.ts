import './assets/styles/styles.scss'
import './assets/styles/variables.scss'
import './components/error-block/error-block.scss'
import './components/login-input/login-input.scss'
import './components/button/button.scss'
import './components/flat-button/flat-button.scss'
import './components/nav/nav.scss'

import { Component } from './components/component.ts';
import { Layout } from './components/layout/layout.ts';
import { Nav } from './components/nav/nav.ts';
import { Link } from './components/link/link.ts';
import { View } from './view/view.ts';

export class MainView extends View {
    createContent(): Component {
        const linkClick = (e: Event) => {
            console.log('link clicked, params: ', e);
        };

        const nav = new Nav(
            {
                attrs: {
                    class: 'nav'
                },
                links: [
                    new Link('li', { url: '/pages/page-error400/page.html', title: 'Ошибка 4**' }),
                    new Link('li', { url: '/pages/page-error500/page.html', title: 'Ошибка 5**' }),
                    new Link('li', { url: '/pages/page-login/page.html', title: 'Авторизация' }),
                    new Link('li', { url: '/pages/registration.html', title: 'Регистрация' }),
                    new Link('li', { url: '/pages/page-chat/page.html', title: 'Чаты' }),
                    new Link('li', { url: '/pages/user-profile.html', title: 'Профиль пользователя' })
                ],
                events: {
                    click: linkClick
                }
            }
        );

        return new Layout(
            'div',
            {
                attrs: {
                    class: 'layout'
                },
                title: 'Главная страница',
                nav: nav,
            }
        );
    }
}

const view = new MainView();

view.renderPage();
