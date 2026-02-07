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
import { chatStore } from '../../stores/chat-store';
import type { Chat } from '../../api/chat-api';

import '../../assets/styles/styles.scss';
import '../../assets/styles/variables.scss';

import { Router } from '../../services/router';
import {userStore} from '../../stores/user-store.ts';

export class ChatsView extends View {
  validator: Validator;
  router: Router;
  private chatListComponent: ChatList | null = null;
  private page: Page | null = null;
  private messagesList: MessagesList | null = null;
  private unsubscribe: Array<() => void> = [];

  constructor() {
    super();

    this.validator = new Validator();
    this.router = Router.getInstance();

    this.loadInitialData();
    this.setupSubscriptions();
  }

  private async loadInitialData(): Promise<void> {
    try {
      await chatStore.fetchChats();
    } catch (error) {
      console.error('Ошибка загрузки чатов:', error);
    }
  }

  private setupSubscriptions(): void {
    this.unsubscribe.push(
      chatStore.on('messages-updated', () => {
        this.updateMessagesList();
      })
    );

    this.unsubscribe.push(
      chatStore.on('chats-fetched', () => {
        this.updateChatList();
      })
    );

    this.unsubscribe.push(
      chatStore.on('chat-created', () => {
        this.updateChatList();
      })
    );

    this.unsubscribe.push(
      chatStore.on('chat-deleted', () => {
        this.updateChatList();
      })
    );

    this.unsubscribe.push(
      chatStore.on('chats-fetch-error', (error) => {
        console.error('Ошибка при загрузке чатов:', error);
      })
    );
  }

  private updateChatList(): void {
    if (!this.chatListComponent) return;

    const chatItems = this.createChatListItems();

    this.chatListComponent.setProps({ chats: chatItems });

    this.rerender(this.page);
  }

  private createChatListItems(): ChatListItem[] {
    const chats = chatStore.getChats();

    return chats.map((chat: Chat) => {
      const lastMessage = chat.last_message;

      return new ChatListItem('div', {
        id: chat.id?.toString(),
        title: chat.title,
        text: lastMessage?.content || 'Нет сообщений',
        newNum: chat.unread_count,
        date: this.formatTime(lastMessage?.time),
        onSelect: async (id: string) => {
          const selectedChat = chatStore.getChats().find(c => c.id.toString() === id);
          if (selectedChat) {
            await this.handleChatClick(selectedChat);
          }
        }
      });
    });
  }

  private formatTime(timeStr?: string): string {
    if (!timeStr) return '';

    const messageDate = new Date(timeStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    }

    const daysDiff = Math.floor((today.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff < 7) {
      const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
      return days[messageDate.getDay()];
    }

    return messageDate.toLocaleDateString('ru-RU');
  }

  private async handleChatClick(chat: Chat): Promise<void> {
    await chatStore.setCurrentChat(chat.id);
  }

  private updateMessagesList(): void {
    const currentChat = chatStore.getCurrentChat();
    if (!currentChat || !this.messagesList) return;

    const user = userStore.getUser();
    const messages = currentChat.messages.map(message => {
      const isOutgoing = user?.id === message.user_id;
      return new Message('div', {
        attrs: { class: `message-container message-container-${isOutgoing ? 'outbox' : 'inbox'}` },
        text: message.content, // Стор уже подготовил данные
        type: isOutgoing ? 'outbox' : 'inbox',
        state: message.is_read ? 'delivered' : 'received',
        date: this.formatDateTime(message.time),
      });
    });

    this.messagesList.setProps({ messages });
    this.rerender(this.page);
  }

  /*private async loadChatMessages(chatId: number): Promise<void> {
    console.log('Загрузка сообщений для чата:', chatId);

    try {
      const tokenData = await chatStore.getChatToken(chatId);
      const token = tokenData.token;

      console.log('Получен токен для чата:', token);

      const user = userStore.getUser();

      this.socket = new WebSocket(`wss://ya-praktikum.tech/ws/chats/${user?.id}/${chatId}/${token}`);

      this.socket.addEventListener('open', () => {
        console.log('Соединение установлено');

        this.socket?.send(JSON.stringify({
          content: '0',
          type: 'get old',
        }));
      });

      this.socket.addEventListener('close', event => {
        if (event.wasClean) {
          console.log('Соединение закрыто чисто');
        } else {
          console.log('Обрыв соединения');
        }

        console.log(`Код: ${event.code} | Причина: ${event.reason}`);
      });

      this.socket.addEventListener('message', event => {
        console.log('Получены данные', event.data);

        const user = userStore.getUser();
        const messageData = JSON.parse(event.data);

        if (Array.isArray(messageData)) {
          this.addMessageArrayToList(messageData
            .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
            .map((message) => {
              const isOutgoing = user?.id === message.user_id;

              let text = '';
              try {
                text = JSON.parse(message.content).message;
              } catch(e) {
                text = message.content;
              }

              return new Message('div', {
                attrs: {
                  class: `message-container message-container-${isOutgoing ? 'outbox' : 'inbox'}`
                },
                text,
                type: isOutgoing ? 'outbox' : 'inbox',
                state: message.is_read ? 'delivered' : 'received',
                date: this.formatDateTime(message.time),
              });
          }));

          return;
        }

        const isOutgoing = true;

        const newMessage = new Message('div', {
          attrs: {
            class: `message-container message-container-${isOutgoing ? 'outbox' : 'inbox'}`
          },
          text: messageData.content.message,
          type: isOutgoing ? 'outbox' : 'inbox',
          state: messageData.is_read ? 'delivered' : 'received',
          date: this.formatDateTime(messageData.time),
        });

        this.addMessageToList(newMessage);
      });

      this.socket.addEventListener('error', event => {
        console.log('Ошибка' + event);
      });

    } catch (error) {
      console.error('Ошибка при получении токена чата:', error);
    }
  }*/

  /*private addMessageArrayToList(messageArray: Message[]): void {
    if (this.messagesList) {

      const currentMessages = this.messagesList._lists.messages || [];
      const updatedMessages = [...currentMessages, ...messageArray];

      this.messagesList.setProps({ messages: updatedMessages });

      this.rerender(this.page);
    }
  }

  private addMessageToList(message: Message): void {
    if (this.messagesList) {

      const currentMessages = this.messagesList._lists.messages || [];
      const updatedMessages = [...currentMessages, message];

      this.messagesList.setProps({ messages: updatedMessages });

      this.rerender(this.page);
    }
  }*/

  formatDateTime = (isoString: string) => {
    const date = new Date(isoString);

    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  renderPage(): Element | null {
    return super.renderPage();
  }

  getContent(): Component {
    const chatItems = this.createChatListItems();

    this.chatListComponent = new ChatList(
      {
        attrs: {
          class: 'chat-list-container',
        },
        chats: chatItems,
      },
    );

    this.messagesList = new MessagesList(
      {
        attrs: {
          class: 'messages-list-container',
        },
        messages: [],
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
      },
    );

    const messageInput = new InputWithValidComponent('div', 'input-container-value', {
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
      inputs: [messageInput],
      button: sendButton,
      showSubmit: true,
      onSubmit: (data: Record<string, string>, isValid: boolean) => {
        if (isValid) {
          console.log('Отправка сообщения:', data);

          if (isValid && data.message) {
            chatStore.sendMessage(data.message);
          }
        } else {
          console.log('Данные невалидны');
        }
      },
    });

    this.page = new Page(
      'div',
      {
        attrs: {
          class: 'pnl',
        },
        template: tmpl,
        title: 'Сообщения',
        chatList: this.chatListComponent,
        messagesList: this.messagesList,
        form,
        link,
      },
    );

    return this.page;
  }

  destroy(): void {
    this.unsubscribe.forEach(unsub => unsub());
    this.unsubscribe = [];
    this.chatListComponent = null;
    this.page = null
  }
}
