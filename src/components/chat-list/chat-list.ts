import { Component } from '../component';
import { tmpl } from './tmpl';
import './chat-list.scss';

export class ChatList extends Component {
  constructor(props: any) {
    super('div', props);
  }

  render(): DocumentFragment {
    return super.render(tmpl);
  }
}
