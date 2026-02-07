import { Component } from '../component';
import type { ComponentProps } from '../../services/types';
import { tmpl } from './tmpl';
import './chat-list.scss';

export class ChatList extends Component {
  constructor(props: ComponentProps) {
    super('div', props);
  }

  componentDidMount(): void {
    this._attachChatItemHandlers();
  }

  /*componentDidUpdate(): boolean {
    this._attachChatItemHandlers();

    return true;
  }*/

  componentDidUpdate(oldProps: any, newProps: any): boolean {

    const oldChats = this._lists.chats;
    const newChats = (newProps as any).chats;

   // if (oldChats !== newChats) {
      this._render(); // Принудительный рендер при изменении списка
    //}

    this._attachChatItemHandlers();
    return true;
  }

  private _attachChatItemHandlers(): void {
    const chatItems = this._lists.chats;

    if (Array.isArray(chatItems)) {
      chatItems.forEach((chatItem) => {
        if (chatItem instanceof Component) {
          chatItem.setProps({
            onClick: (id: string) => this._handleChatItemClick(id),
          });
        }
      });
    }
  }

  private _handleChatItemClick(clickedId: string): void {
    const chatItems = this._lists.chats;

    if (Array.isArray(chatItems)) {
      chatItems.forEach((chatItem) => {
        if (chatItem instanceof Component) {
          const selected = chatItem.props.id === clickedId;

          chatItem.setProps({
            selected,
          });

          if (selected && typeof chatItem.props.onSelect === 'function') {
            // @ts-ignore
            chatItem.props.onSelect(clickedId);
          }
        }
      });
    }
  }

  render(): DocumentFragment {
    return super.render(tmpl);
  }
}
