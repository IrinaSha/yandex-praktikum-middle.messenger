import './chat-list-item.scss';
import '../../assets/styles/variables.scss';

import { Component } from '../component';
import { tmpl } from './tmpl';

export class ChatListItem extends Component {
  constructor(tagName: string, props: any) {
    super(tagName, {
      ...props,
      events: {
        click: (e: Event) => this.handleClick(e),
      },
    });
  }

  handleClick(e: Event) {
    e.preventDefault();

    const allChatItems = document.querySelectorAll('.chat-item-container');
    allChatItems.forEach(item => item.classList.remove('active'));

    this.getContent()?.classList.add('active');
  }

  render(): DocumentFragment {
    return super.render(tmpl);
  }
}
