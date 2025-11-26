import '../../assets/styles/styles.scss'
import '../../assets/styles/variables.scss'

import { View } from "../../view/view.ts";
import { Component } from "../../components/component.ts";
import { Link } from "../../components/link/link.ts";
import { Page } from "../../components/page/page.ts";
import { Button } from "../../components/button/button.ts";
import {InputComponent} from "../../components/login-input/login-input.ts";

export class LoginView extends View {
    createContent(): Component {
        const linkClick = (e: Event) => {
            console.log('login link clicked, params: ', e);
        };

        const link = new Link(
            'span',
            {
                attrs: {
                    class: "nav-container text"
                },
                url: '../../pages/registration.html',
                title: 'Нет аккаунта?',
                events: {
                    click: linkClick
                }
            });

        const sendButton = new Button(
            'button',
            {
                attrs: {
                    class: 'btn-container',
                    type: 'submit'
                },
                btnText: 'Авторизоваться',
            }
        );

        const inputLogin = new InputComponent(
            'div',
            {
                attrs: {
                    class: 'input-container'
                },
                name: 'login',
                inputType: 'text',
                errorText: 'Неверный логин',
                labelText: 'Логин',
            }
        );

        const inputPwd = new InputComponent(
            'div',
            {
                attrs: {
                    class: 'input-container'
                },
                name: 'password',
                inputType: 'password',
                errorText: 'Неверный пароль',
                labelText: 'Пароль',
            }
        );

        /*const form = new FormComponent (
            'form',
            {
                inputs: [
                    new InputComponent('li', { url: '/pages/page-error400/page.html', title: 'Ошибка 4**' }),
                    new InputComponent('li', { url: '/pages/page-error500/page.html', title: 'Ошибка 5**' }),
                ],
                sendButton: sendButton,
            },
        );*/

        return new Page(
            'div',
            {
                attrs: {
                    class: 'pnl pnl__bordered'
                },
                title: 'Вход',
                //form: form,
                inputLogin: inputLogin,
                inputPwd: inputPwd,
                link: link,
                sendButton: sendButton,
            }
        );
    }
}

const view = new LoginView();

view.renderPage();

