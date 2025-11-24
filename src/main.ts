import './assets/styles/styles.scss'
import './assets/styles/variables.scss'
import './components/error-block/error-block.scss'
import './components/login-input/login-input.scss'
import './components/button/button.scss'
import './components/flat-button/flat-button.scss'
import './components/nav/nav.scss'

import { render } from './services/utils.ts';
import { Page } from './components/page/page.ts';
import { Nav } from './components/nav/nav.ts';
import { Link } from './components/link/link.ts';

const linkClick = (e: Event) => {
    console.log('link clicked, params: ', e);
};

const nav = new Nav(
    {
        attrs: {
            class: 'nav'
        },
        links: [
            new Link('li', { url: '/pages/error-400.html', title: 'Ошибка 4**' }),
            new Link('li', { url: '/pages/error-500.html', title: 'Ошибка 5**' }),
            new Link('li', { url: '/pages/login.html', title: 'Авторизация' }),
            new Link('li', { url: '/pages/registration.html', title: 'Регистрация' }),
            new Link('li', { url: '/pages/chats.html', title: 'Чаты' }),
            new Link('li', { url: '/pages/user-profile.html', title: 'Профиль пользователя' })
        ],
        events: {
            click: linkClick
        }
    }
);

const page = new Page(
    'div',
    {
        attrs: {
            class: 'page'
        },
        nav: nav,
        title: 'Заголовок'
    }
);

render('.app', page);

/*setTimeout(() => {
nav.setProps({items: [
    { url: '/pages/error-400.html', title: 'Ошибка 4**' },
    { url: '/pages/error-500.html', title: 'Ошибка 5*55555*' },
    { url: '/pages/login.html', title: 'Авторизация' },
    { url: '/pages/registration.html', title: 'Регистрация' },
    { url: '/pages/chats.html', title: 'Чаты' },
    { url: '/pages/user-profile.html', title: 'Профиль пользователя' },
]})}, 1000);

setTimeout(() => {
        //page.setProps({title: 'Заголовок'});
        page.setProps({title: 'Заголовок1', title2: '111'})
    },
    3000);*/