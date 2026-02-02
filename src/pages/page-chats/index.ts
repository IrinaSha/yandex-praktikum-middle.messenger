import { View } from '../../view/view';
import { Component } from '../../components/component';
import { Link } from '../../components/link/link';
import { Page } from '../../components/page/page';
import { Button } from '../../components/button/button';
import { Validator } from '../../services/validator';
import { InputWithValidComponent } from '../../components/input-with-valid/input-with-valid';
import { Form } from '../../components/form/form';
import { MessagesList } from '../../components/messages-list/messages-list';
import { Message } from '../../components/message/message';
import { ChatList } from '../../components/chat-list/chat-list';
import { ChatListItem } from '../../components/chat-list-item/chat-list-item';
import { tmpl } from './tmpl';

import '../../assets/styles/styles.scss';
import '../../assets/styles/variables.scss';

import { Router } from '../../services/router';

export class ChatsView extends View {
  validator: Validator;
  router: Router;

  constructor() {
    super();

    this.validator = new Validator();
    this.router = Router.getInstance('.app');
  }

  renderPage(): Element | null {
    return super.renderPage();
  }

  getContent(): Component {
    const messagesList = new MessagesList(
      {
        attrs: {
          class: 'messages-list-container',
        },
        messages: [
          new Message('div', {
            attrs: { class: 'message-container message-container-inbox' },
            text: 'Привет! Как дела?',
            type: 'inbox',
            state: 'delivered',
            date: '12.12.25',
            time: '11:30',
          }),
          new Message('div', {
            attrs: { class: 'message-container message-container-outbox' },
            text: 'Привет! Все хорошо',
            type: 'outbox',
            state: 'read',
            date: '12.12.25',
            time: '11:55',
          }),
          new Message('div', {
            attrs: { class: 'message-container message-container-outbox' },
            text: 'Привет! А у тебя?',
            type: 'outbox',
            state: 'read',
            date: '12.12.25',
            time: '11:55',
          }),
          new Message('div', {
            attrs: { class: 'message-container message-container-inbox' },
            text: 'Нормально. Смотри, тут всплыл интересный кусок лунной космической истории',
            type: 'inbox',
            state: 'delivered',
            date: '12.12.25',
            time: '11:30',
          }),
        ],
      },
    );

    const chatList = new ChatList(
      {
        attrs: {
          class: 'chat-list-container',
        },
        chats: [
          new ChatListItem('div', {
            id: 'chat-1',
            title: 'Роман Дряблов',
            text: 'Привет! Как дела?',
            newNum: 2,
            date: '11:30',
          }),
          new ChatListItem('div', {
            id: 'chat-2',
            title: 'Егор Лесников',
            text: 'Идем в театр?',
            newNum: 2,
            date: '12.12.25',
          }),
          new ChatListItem('div', {
            id: 'chat-3',
            title: 'Балтийский дом',
            text: 'Афиша спектаклей на следующую неделю',
            newNum: 2,
            date: 'Пт',
          }),
        ],
      },
    );

    const link = new Link(
      'span',
      {
        attrs: {
          class: 'link link-exit',
        },
        url: '/settings',
        title: 'Профиль',
        /*events: {
          click: async(e: Event) => {
            e.preventDefault();
          }
        }*/
      },
    );

    const loginInput = new InputWithValidComponent('div', 'input-container-value', {
      attrs: {
        class: 'input-container',
      },
      name: 'message',
      inputType: 'text',
      errorText: 'Сообщение не может быть пустым',
      labelText: 'Сообщение',
      noValid: false,
      validationType: 'message',
    });

    const sendButton = new Button(
      'button',
      {
        attrs: {
          class: 'btn-container',
          type: 'submit',
        },
        btnText: 'Отправить',
      },
    );

    const form = new Form('form', {
      attrs: {
        class: 'login-form',
      },
      inputs: [loginInput],
      button: sendButton,
      showSubmit: true,
      onSubmit: (data: Record<string, string>, isValid: boolean) => {
        if (isValid) {
          console.log('Данные:', data);
        } else {
          console.log('Данные невалидны');
        }
      },
    });

    return new Page(
      'div',
      {
        attrs: {
          class: 'pnl',
        },
        template: tmpl,
        title: 'Сообщения',
        chatList,
        messagesList,
        form,
        link,
      },
    );
  }
}
