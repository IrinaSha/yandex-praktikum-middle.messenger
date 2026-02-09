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
import { userStore } from '../../stores/user-store';
import { Modal } from '../../components/modal/modal';

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

    window.addEventListener('popstate', () => this.syncChatWithUrl());

    this.loadInitialData();
    this.setupSubscriptions();
  }

  private async syncChatWithUrl() {
    const params = this.router.getParams();

    if (params.chatId) {
      const chatId = parseInt(params.chatId, 10);
      if (chatStore.getCurrentChat()?.id !== chatId) {
        await chatStore.setCurrentChat(chatId);
      }
    } else {
      await chatStore.setCurrentChat(null);
    }
  }

  private async loadInitialData(): Promise<void> {
    try {
      await chatStore.fetchChats();
      await this.syncChatWithUrl();
    } catch (error) {
      console.error('Ошибка загрузки чатов:', error);
    }
  }

  private setupSubscriptions(): void {
    this.unsubscribe.push(
      chatStore.on('messages-updated', () => {
        this.updateMessagesList();
      }),
    );

    this.unsubscribe.push(
      chatStore.on('chats-fetched', () => {
        this.updateChatList();
      }),
    );

    this.unsubscribe.push(
      chatStore.on('chat-created', () => {
        this.updateChatList();
      }),
    );

    this.unsubscribe.push(
      chatStore.on('chat-deleted', () => {
        this.updateChatList();
      }),
    );

    this.unsubscribe.push(
      chatStore.on('chats-fetch-error', (error) => {
        console.error('Ошибка при загрузке чатов:', error);
      }),
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
        onSelect: async (event: Event) => {
          const id = event instanceof CustomEvent ? event.detail.id : '';
          const selectedChat = chatStore.getChats().find((c) => c.id.toString() === id);

          if (selectedChat) {
            await this.handleChatClick(selectedChat);
          }
        },
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
        minute: '2-digit',
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
    const targetUrl = `/messenger/${chat.id}`;
    if (window.location.pathname !== targetUrl) {
      this.router.go(targetUrl);
      await chatStore.setCurrentChat(chat.id);
    }
  }

  private updateMessagesList(): void {
    const currentChat = chatStore.getCurrentChat();

    if (!currentChat || !this.messagesList) {
      if (this.page) {
        this.page.setProps({
          messagesSectionClass: 'hidden',
          currentChatTitle: '',
        });
        this.rerender(this.page);
      }

      return;
    }

    const user = userStore.getUser();
    const messages = currentChat.messages.map((message) => {
      const isOutgoing = user?.id === message.user_id;

      return new Message('div', {
        attrs: { class: `message-container message-container-${isOutgoing ? 'outbox' : 'inbox'}` },
        text: message.content,
        type: isOutgoing ? 'outbox' : 'inbox',
        state: message.is_read ? 'delivered' : 'received',
        date: this.formatDateTime(message.time),
      });
    });

    this.messagesList.setProps({ messages });

    if (this.page) {
      this.page.setProps({
        messagesSectionClass: '',
        currentChatTitle: currentChat.title,
      });
    }

    setTimeout(() => {
      this.scrollToBottom();
    }, 0);

    this.rerender(this.page);
  }

  private scrollToBottom(): void {
    const container = this.messagesList?.getContent();

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

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
          class: 'profile-link',
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
        class: 'message-form login-form',
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

    const currentChat = chatStore.getCurrentChat();
    const messagesSectionClass = currentChat ? '' : 'hidden';

    const addUserBtn = new Button('button', {
      attrs: { class: 'btn-container', type: 'button' },
      btnText: 'Добавить пользователя',
      events: {
        click: () => this.openModal({
          title: 'Добавить пользователя',
          placeholder: 'Логин пользователя',
          action: async (login) => {
            try {
              await chatStore.addUserToChat(login);
              alert(`В чат добавлен ${login}`);
            } catch (error) {
              alert(`Ошибка добавления пользователя - ${error}`);
            }
          },
        }),
      },
    });

    const removeUserBtn = new Button('button', {
      attrs: { class: 'btn-container', type: 'button' },
      btnText: 'Удалить пользователя',
      events: {
        click: () => this.openModal({
          title: 'Удалить пользователя',
          placeholder: 'Логин пользователя',
          action: async (login) => {
            try {
              await chatStore.removeUsersFromChat(login);
              alert(`Из чата удален ${login}`);
            } catch (error) {
              alert(`Ошибка добавления пользователя - ${error}`);
            }
          },
        }),
      },
    });

    const addChatBtn = new Button('button', {
      attrs: { class: 'btn-container', type: 'button' },
      btnText: 'Новый чат',
      events: {
        click: () => this.openModal({
          title: 'Создать чат',
          placeholder: 'Название чата',
          action: async (title) => {
            try {
              await chatStore.createChat(title);
              alert(`Создан чат ${title}`);
            } catch (error) {
              alert(`Ошибка добавления пользователя - ${error}`);
            }
          },
        }),
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
        currentChatTitle: currentChat?.title || '',
        chatList: this.chatListComponent,
        messagesList: this.messagesList,
        addUserBtn,
        removeUserBtn,
        addChatBtn,
        form,
        link,
        messagesSectionClass,
      },
    );

    return this.page;
  }

  private openModal(config: { title: string, placeholder: string, action: (val: string) => void }) {
    const modal = new Modal({
      title: config.title,
      placeholder: config.placeholder,
      onConfirm: (value) => {
        if (value.trim()) {
          config.action(value);
          this.closeModal();
        }
      },
      onClose: () => this.closeModal(),
    });

    document.body.appendChild(modal.getContent()!);
  }

  private closeModal() {
    const modalElement = document.querySelector('.modal');
    if (modalElement) {
      modalElement.remove();
    }
  }

  destroy(): void {
    this.unsubscribe.forEach((unsub) => unsub());
    this.unsubscribe = [];
    this.chatListComponent = null;
    this.page = null;
  }
}
