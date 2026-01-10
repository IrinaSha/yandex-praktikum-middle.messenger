import './chat-list-item.scss';
import '../../assets/styles/variables.scss';

import { Component } from '../component';
import { tmpl } from './tmpl';
import type { ComponentProps } from '../../services/types';

export interface ChatListItemProps extends ComponentProps {
  id: string;
  avatar?: string;
  title: string;
  text: string;
  date: string;
  newNum?: number;
  selected?: boolean;
  onClick?: (id: string) => void;
}

export class ChatListItem extends Component {
  constructor(tagName: string, props: ChatListItemProps) {
    super(tagName, {
      ...props,
      selected: props.selected || false,
      events: {
        click: (e: Event) => this.handleClick(e),
      },
    });
  }

  handleClick(e: Event): void {
    e.preventDefault();

    const { onClick, id } = this._props as ChatListItemProps;

    if (onClick) {
      onClick(id);
    }
  }

  componentDidUpdate(oldProps: ChatListItemProps, newProps: ChatListItemProps): boolean {
    return oldProps.selected !== newProps.selected;
  }

  render(): DocumentFragment {
    return super.render(tmpl);
  }
}
