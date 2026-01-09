import { Component } from '../component';
import { tmpl } from './tmpl';
import './messages-list.scss';

export class MessagesList extends Component {
  constructor(props: any) {
    super('div', props);
  }

  render(): DocumentFragment {
    return super.render(tmpl);
  }
}
