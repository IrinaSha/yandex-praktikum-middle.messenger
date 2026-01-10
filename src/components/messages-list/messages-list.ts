import { Component } from '../component';
import { tmpl } from './tmpl';
import type { ComponentProps } from '../../services/types';
import './messages-list.scss';

export class MessagesList extends Component {
  constructor(props: ComponentProps) {
    super('div', props);
  }

  render(): DocumentFragment {
    return super.render(tmpl);
  }
}
