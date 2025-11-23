import './assets/styles/styles.scss'
import './assets/styles/variables.scss'
import './components/error-block/error-block.scss'
import './components/login-input/login-input.scss'
import './components/button/button.scss'
import './components/flat-button/flat-button.scss'
import './components/nav/nav.scss'

import { Nav } from './components/nav/nav.ts';
import { render } from './services/utils.ts';

const nav = new Nav(
    {
        attrs: {
            class: 'nav'
        },
        items: [
            { url: '/pages/error-400.html', title: 'Ошибка 4**' },
            { url: '/pages/error-500.html', title: 'Ошибка 5**' },
            { url: '/pages/login.html', title: 'Авторизация' },
            { url: '/pages/registration.html', title: 'Регистрация' },
            { url: '/pages/chats.html', title: 'Чаты' },
            { url: '/pages/user-profile.html', title: 'Профиль пользователя' },
        ],
        events: {
            click: (e: Event) => {
                console.log('link clicked');

                //e.preventDefault();
               // e.stopPropagation();

                /*const target = e.target as HTMLElement;

                if (target?.getAttribute('href')) {
                    console.log('link clicked');

                    e.preventDefault();
                    e.stopPropagation();
                } else {
                    console.log('no link clicked');
                }/*/
            }
        }
    }
);

render('.app', nav);

/*setTimeout(() => {
nav.setProps({items: [
    { url: '/pages/error-400.html', title: 'Ошибка 4**' },
    { url: '/pages/error-500.html', title: 'Ошибка 5*55555*' },
    { url: '/pages/login.html', title: 'Авторизация' },
    { url: '/pages/registration.html', title: 'Регистрация' },
    { url: '/pages/chats.html', title: 'Чаты' },
    { url: '/pages/user-profile.html', title: 'Профиль пользователя' },
]})}, 1000);*/
