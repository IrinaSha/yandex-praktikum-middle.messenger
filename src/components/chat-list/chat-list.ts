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

  componentDidUpdate(): boolean {
    //this._render();
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
            const selectEvent = new CustomEvent('select', { detail: { id: clickedId } });

            (chatItem.props.onSelect as (event: Event) => void)(selectEvent);
          }
        }
      });
    }
  }

  render(): DocumentFragment {
    return super.render(tmpl);
  }
}
